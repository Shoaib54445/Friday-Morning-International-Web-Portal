import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/** Fetch all active categories. Pass { navbarOnly: true } to filter show_in_navbar. */
export function useCategories({ navbarOnly = false, featuredOnly = false } = {}) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (navbarOnly) query = query.eq('show_in_navbar', true)
    if (featuredOnly) query = query.eq('is_featured', true)

    query.then(({ data, error }) => {
      if (error) setError(error)
      else setCategories(data || [])
      setLoading(false)
    })
  }, [navbarOnly, featuredOnly])

  return { categories, loading, error }
}

/** Fetch products with optional filters */
export function useProducts({ categorySlug, trending, limit } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name, slug),
            images:product_images(id, cloudinary_url, sort_order, is_primary)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (trending) query = query.eq('is_trending', true)
        if (limit) query = query.limit(limit)
        if (categorySlug) {
          // Join via category slug
          const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single()
          if (cat) query = query.eq('category_id', cat.id)
        }

        const { data, error } = await query
        if (error) throw error
        // Sort images by sort_order for each product
        const withSortedImages = (data || []).map(p => ({
          ...p,
          images: [...(p.images || [])].sort((a, b) => a.sort_order - b.sort_order)
        }))
        setProducts(withSortedImages)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [categorySlug, trending, limit])

  return { products, loading, error }
}

/** Fetch a single product by slug */
export function useProduct(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(id, cloudinary_url, cloudinary_public_id, sort_order, is_primary)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error)
        else setProduct(data ? {
          ...data,
          images: [...(data.images || [])].sort((a, b) => a.sort_order - b.sort_order)
        } : null)
        setLoading(false)
      })
  }, [slug])

  return { product, loading, error }
}

/** Fetch approved reviews */
export function useReviews({ productId, limit } = {}) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = supabase
      .from('reviews')
      .select('*, product:products(name)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (productId) query = query.eq('product_id', productId)
    if (limit) query = query.limit(limit)

    query.then(({ data }) => {
      setReviews(data || [])
      setLoading(false)
    })
  }, [productId, limit])

  return { reviews, loading }
}

/** Fetch active banners */
export function useBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setBanners(data || [])
        setLoading(false)
      })
  }, [])

  return { banners, loading }
}
