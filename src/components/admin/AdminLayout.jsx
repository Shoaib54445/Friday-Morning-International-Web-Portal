import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Tag, Package, Star, Mail,
  Image, LogOut, Menu, X, ExternalLink
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard',     to: '/1972/admin/dashboard',  icon: LayoutDashboard },
  { label: 'Categories',    to: '/1972/admin/categories', icon: Tag },
  { label: 'Products',      to: '/1972/admin/products',   icon: Package },
  { label: 'Reviews',       to: '/1972/admin/reviews',    icon: Star },
  { label: 'Contact Leads', to: '/1972/admin/contact',    icon: Mail },
  { label: 'Hero Banners',  to: '/1972/admin/banners',    icon: Image },
]

const SIDEBAR_W = 240

// Shared sidebar contents — used for both desktop & mobile drawer
function SidebarContents({ onClose }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out.')
    navigate('/1972/admin/login')
  }

  return (
    <>
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,252,248,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <img
            src="/logo.png" alt="Friday Morning"
            style={{ height: 40, filter: 'brightness(0) invert(1) sepia(1) saturate(0.3) brightness(1.8)' }}
          />
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', marginTop: 4 }}>
            Admin Panel
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,252,248,0.6)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: '0.875rem', fontWeight: 500,
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(212,168,83,0.15)' : 'transparent',
                color: isActive ? 'var(--color-gold)' : 'rgba(255,252,248,0.65)',
                borderLeft: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer: public site link + sign out */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,252,248,0.08)', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
        <a
          href="/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: '0.8rem', color: 'rgba(255,252,248,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
        >
          <ExternalLink size={14} /> View Public Site
        </a>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: 'none', border: 'none', fontSize: '0.8rem', color: 'rgba(255,252,248,0.5)', cursor: 'pointer', width: '100%', textAlign: 'left' }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* ── Responsive styles ─────────────────────────────────── */}
      <style>{`
        .admin-sidebar-desktop {
          display: flex;
        }
        .admin-hamburger {
          display: none;
        }
        @media (max-width: 768px) {
          .admin-sidebar-desktop {
            display: none !important;
          }
          .admin-hamburger {
            display: flex !important;
          }
        }
      `}</style>

      {/* ── Root flex container ────────────────────────────────── */}
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-cream)' }}>

        {/* Desktop sidebar — TRUE flex item, NOT position:fixed */}
        <aside
          className="admin-sidebar-desktop"
          style={{
            width: SIDEBAR_W,
            minWidth: SIDEBAR_W,    // never shrink below this
            flexShrink: 0,          // flex must not compress it
            background: 'var(--color-charcoal)',
            flexDirection: 'column',
            position: 'sticky',     // stays in view when page scrolls
            top: 0,
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <SidebarContents />
        </aside>

        {/* Mobile drawer overlay */}
        {sidebarOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 900, display: 'flex' }}>
            {/* Backdrop */}
            <div
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }}
            />
            {/* Drawer */}
            <aside style={{
              position: 'relative', zIndex: 1,
              width: 260, flexShrink: 0,
              background: 'var(--color-charcoal)',
              display: 'flex', flexDirection: 'column',
              height: '100vh', overflowY: 'auto',
            }}>
              <SidebarContents onClose={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        {/* ── Main content — grows to fill remaining width ─────── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

          {/* Top bar */}
          <header style={{
            height: 60,
            background: 'white',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center',
            padding: '0 24px', gap: 16,
            position: 'sticky', top: 0, zIndex: 100,
            boxShadow: '0 1px 8px rgba(44,36,23,0.05)',
            flexShrink: 0,
          }}>
            {/* Hamburger — mobile only */}
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-bronze)', padding: 4 }}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              Friday Morning International — CMS
            </span>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, padding: 'clamp(20px, 3vw, 32px) clamp(16px, 3vw, 28px)', overflow: 'hidden' }}>
            <Outlet />
          </main>
        </div>

      </div>
    </>
  )
}
