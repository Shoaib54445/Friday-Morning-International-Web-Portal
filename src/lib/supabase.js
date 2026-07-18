import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing environment variables. ' +
    'Copy .env.example to .env and fill in your project credentials.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      storage: typeof window !== 'undefined' ? window.sessionStorage : undefined, // Session cleared when browser tab/window closes
      autoRefreshToken: true,     // Silently refresh JWT before expiry while tab is open
      storageKey: 'fm-admin',     // Namespaced key in sessionStorage
      detectSessionInUrl: true,   // Handle magic-link / OAuth redirects
    },
  }
)
