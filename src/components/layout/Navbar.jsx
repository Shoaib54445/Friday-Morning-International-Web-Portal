import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Search } from 'lucide-react'
import { useCategories } from '../../hooks/useData'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { categories } = useCategories({ navbarOnly: true })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  const navLinks = [
    ...categories.map(cat => ({
      label: cat.name,
      href: `/category/${cat.slug}`,
      external: false,
    })),
  ]

  const scrollToContact = (e) => {
    e.preventDefault()
    setDrawerOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 400)
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* ── Navbar ─────────────────────────────── */}
      <nav
        id="navbar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 900,
          background: scrolled ? 'rgba(250, 247, 242, 0.97)' : 'rgba(250, 247, 242, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 2px 20px rgba(44, 36, 23, 0.08)' : 'none',
        }}
      >
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}>
          {/* Logo */}
          <Link to="/" aria-label="Friday Morning International — Home">
            <img
              src="/logo.png"
              alt="Friday Morning International"
              style={{ height: 54, objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  color: 'var(--color-charcoal-mid)',
                  transition: 'color 0.2s ease',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--color-copper)'}
                onMouseLeave={e => e.target.style.color = 'var(--color-charcoal-mid)'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href="#contact"
              onClick={scrollToContact}
              className="btn-primary hide-mobile"
              style={{ padding: '9px 20px', fontSize: '0.8rem' }}
            >
              Contact Us
            </a>
            {/* Hamburger */}
            <button
              className="hide-desktop"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-bronze)', padding: 4,
              }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ──────────────────────── */}
      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(44, 36, 23, 0.5)',
            zIndex: 1000, backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 300, maxWidth: '85vw',
          background: 'var(--color-warm-white)',
          zIndex: 1001,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-8px 0 40px rgba(44, 36, 23, 0.15)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <img src="/logo.png" alt="Friday Morning" style={{ height: 44 }} />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-bronze)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer links */}
        <nav style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 12 }}>
            Shop by Category
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setDrawerOpen(false)}
                style={{
                  padding: '12px 0',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--color-charcoal)',
                  borderBottom: '1px solid var(--color-cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                }}
              >
                {link.label}
                <span style={{ color: 'var(--color-copper)', fontSize: '1.1rem' }}>›</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Drawer footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--color-border)' }}>
          <a
            href="#contact"
            onClick={scrollToContact}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </>
  )
}
