import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'auth' | 'unauth'

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setStatus(user ? 'auth' : 'unauth')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session?.user ? 'auth' : 'unauth')
    })
    return () => listener?.subscription?.unsubscribe()
  }, [])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="" style={{ height: 40, marginBottom: 20, opacity: 0.6 }} />
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>Verifying access…</p>
        </div>
      </div>
    )
  }

  if (status === 'unauth') return <Navigate to="/1972/admin/login" replace />
  return children
}
