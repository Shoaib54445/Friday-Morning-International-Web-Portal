import { supabase } from './supabase'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * Extract Cloudinary public_id from a full URL or return if already a public_id.
 * @param {string} str
 * @returns {string | null}
 */
export function getPublicIdFromUrl(str) {
  if (!str) return null
  if (typeof str !== 'string') return null
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    return str
  }
  try {
    const parts = str.split('/image/upload/')
    if (parts.length < 2) return null
    let path = parts[1]
    const pathSegments = path.split('/')
    const cleanSegments = pathSegments.filter(seg => !/^v\d+$/.test(seg) && !seg.includes(','))
    let cleanPath = cleanSegments.join('/')
    const lastDotIndex = cleanPath.lastIndexOf('.')
    if (lastDotIndex !== -1) {
      cleanPath = cleanPath.substring(0, lastDotIndex)
    }
    return cleanPath
  } catch (e) {
    return null
  }
}

/**
 * Delete one or more images from Cloudinary via Supabase Edge Function.
 * Accepts public IDs or full Cloudinary URLs.
 * @param {string | string[]} input
 */
export async function deleteCloudinaryImages(input) {
  if (!input) return
  const rawList = Array.isArray(input) ? input : [input]
  const publicIds = rawList.map(getPublicIdFromUrl).filter(Boolean)

  if (publicIds.length === 0) return

  try {
    const { data, error } = await supabase.functions.invoke('delete-cloudinary-image', {
      body: { public_ids: publicIds }
    })
    if (error) {
      console.warn('Cloudinary image deletion edge function warning:', error)
    } else {
      console.log('Cloudinary images deleted:', data)
    }
  } catch (err) {
    console.warn('Failed to invoke delete-cloudinary-image edge function:', err)
  }
}

/**
 * Upload a single File to Cloudinary via unsigned upload.
 * @param {File} file - The image file to upload
 * @param {string} [folder='friday-morning'] - Cloudinary folder path
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadImage(file, folder = 'friday-morning') {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env'
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Cloudinary upload failed: ${err.error?.message || res.statusText}`)
  }

  const data = await res.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}

/**
 * Build an optimized Cloudinary URL with transformations.
 * @param {string} publicId - Cloudinary public ID
 * @param {{ width?: number, height?: number, quality?: string, format?: string }} options
 * @returns {string}
 */
export function getOptimizedUrl(publicId, { width, height, quality = 'auto', format = 'auto' } = {}) {
  if (!CLOUD_NAME || !publicId) return ''
  const transforms = [
    `q_${quality}`,
    `f_${format}`,
    width && `w_${width}`,
    height && `h_${height}`,
    'c_fill',
    'g_auto',
  ].filter(Boolean).join(',')
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

