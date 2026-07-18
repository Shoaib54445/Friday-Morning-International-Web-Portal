// supabase/functions/delete-cloudinary-image/index.ts
// Deployed via: supabase functions deploy delete-cloudinary-image
// Secrets needed:
//   supabase secrets set CLOUDINARY_CLOUD_NAME=xxxx
//   supabase secrets set CLOUDINARY_API_KEY=xxxx
//   supabase secrets set CLOUDINARY_API_SECRET=xxxx

import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function sha256Hex(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)

  try {
    const body = await req.json()
    const { public_id, public_ids } = body
    const rawIds: string[] = Array.isArray(public_ids)
      ? public_ids
      : public_id
      ? [public_id]
      : []

    const idsToDelete = rawIds.filter((id) => typeof id === 'string' && id.trim().length > 0)

    if (idsToDelete.length === 0) {
      return json({ success: true, message: 'No public IDs provided.' }, 200)
    }

    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME') || Deno.env.get('VITE_CLOUDINARY_CLOUD_NAME')
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn('Cloudinary secrets missing (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).')
      return json({ error: 'Cloudinary API credentials are not configured in Supabase secrets.' }, 500)
    }

    const results = []
    for (const pid of idsToDelete) {
      const timestamp = Math.floor(Date.now() / 1000).toString()
      // Signature string: public_id=<pid>&timestamp=<timestamp><apiSecret>
      const toSign = `public_id=${pid}&timestamp=${timestamp}${apiSecret}`
      const signature = await sha256Hex(toSign)

      const formData = new FormData()
      formData.append('public_id', pid)
      formData.append('api_key', apiKey)
      formData.append('timestamp', timestamp)
      formData.append('signature', signature)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      results.push({ public_id: pid, result: data.result })
    }

    return json({ success: true, results })
  } catch (err: any) {
    console.error('Cloudinary deletion error:', err)
    return json({ error: err.message || 'Cloudinary deletion failed.' }, 500)
  }
})
