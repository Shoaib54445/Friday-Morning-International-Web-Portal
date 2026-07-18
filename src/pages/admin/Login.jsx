import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please enter email and password.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message || 'Invalid credentials. Please try again.')
    } else {
      toast.success('Welcome back!')
      navigate('/1972/admin/dashboard')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-charcoal)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Decorative bg */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(212,168,83,0.06) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(184,115,51,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'var(--color-warm-white)',
        borderRadius: 20,
        padding: '48px 40px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src="/logo.png" alt="Friday Morning International" style={{ height: 48, marginBottom: 12 }} />
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-copper)' }}>
            Admin Panel
          </p>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-bronze)', textAlign: 'center', marginBottom: 32 }}>
          Sign In
        </h1>

        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="form-label" htmlFor="admin-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input
                  id="admin-email"
                  type="email"
                  className="form-field"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 40 }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="admin-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input
                  id="admin-password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 2
                  }}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: 8, fontSize: '0.9rem' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: 28, lineHeight: 1.6 }}>
          Admin access only. To create your first admin account, go to<br />
          Supabase Dashboard → Authentication → Users → Invite User.
        </p>
      </div>
    </div>
  )
}
