import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Camera, Share2, MessageCircle, Play, Send } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const socialLinks = [
  { icon: Camera,        label: 'Instagram',  href: '#' },
  { icon: Share2,        label: 'Facebook',   href: '#' },
  { icon: Play,          label: 'YouTube',    href: '#' },
  { icon: MessageCircle, label: 'X (Twitter)',href: '#' },
]

const quickLinks = [
  { label: 'Our Story',    href: '/#story' },
  { label: 'Shop All',     href: '/category/candle-holders' },
  { label: 'Trending Now', href: '/trending' },
  { label: 'Contact Us',   href: '/#contact' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleNewsletter = async (e) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('newsletter_signups').insert({ email })
    setLoading(false)
    if (error) {
      if (error.code === '23505') {
        toast('You\'re already subscribed! We\'ll be in touch.', { icon: '💌' })
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } else {
      toast.success('Welcome! You\'re on the list.')
      setEmail('')
    }
  }

  const handleAnchorLink = (e, href) => {
    e.preventDefault()
    const [path, hash] = href.split('#')
    if (path === '/' || path === '') {
      if (hash) {
        const el = document.getElementById(hash)
        if (el) { el.scrollIntoView({ behavior: 'smooth' }) }
        else { navigate('/'); setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 400) }
      }
    } else {
      navigate(href)
    }
  }

  return (
    <footer style={{ background: 'var(--color-charcoal)', color: 'rgba(255,252,248,0.8)' }}>
      {/* Main footer grid */}
      <div style={{
        maxWidth: 1400, margin: '0 auto', padding: '64px 24px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 48,
      }}>
        {/* Brand column */}
        <div>
          {/* ── Item 2: no CSS filter — logo displays in its original colours ── */}
          <img
            src="/logo.png"
            alt="Friday Morning International"
            style={{ height: 60, marginBottom: 20, objectFit: 'contain' }}
          />
          <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'rgba(255,252,248,0.65)', maxWidth: 260 }}>
            Handcrafted brass and aluminium home décor, born from the ancient metal-working traditions of Moradabad — India's Brass City.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1px solid rgba(255,252,248,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,252,248,0.7)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--color-copper)'
                  e.currentTarget.style.borderColor = 'var(--color-copper)'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(255,252,248,0.2)'
                  e.currentTarget.style.color = 'rgba(255,252,248,0.7)'
                }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 20 }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quickLinks.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleAnchorLink(e, link.href)}
                  style={{
                    fontSize: '0.875rem', color: 'rgba(255,252,248,0.65)',
                    textDecoration: 'none', transition: 'color 0.2s ease',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,252,248,0.65)'}
                >
                  <span style={{ color: 'var(--color-copper)' }}>›</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info — Items 10 & 11: real details + clickable links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 20 }}>
            Get in Touch
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-copper)', marginBottom: 4 }}>Email</p>
              <a
                href="https://mail.google.com/mail/?view=cm&to=info@fridaymorning.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.875rem', color: 'rgba(255,252,248,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,252,248,0.65)'}
              >
                info@fridaymorning.in
              </a>
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-copper)', marginBottom: 4 }}>Phone</p>
              <a
                href="tel:+919897754310"
                style={{ fontSize: '0.875rem', color: 'rgba(255,252,248,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,252,248,0.65)'}
              >
                +91 98977 54310
              </a>
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-copper)', marginBottom: 4 }}>Address</p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,252,248,0.65)', lineHeight: 1.6 }}>Moradabad, Uttar Pradesh, India</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 8 }}>
            Stay Inspired
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,252,248,0.55)', marginBottom: 16, lineHeight: 1.6 }}>
            New collections, craft stories, and exclusive previews — in your inbox.
          </p>
          <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email for newsletter"
              style={{
                flex: 1, padding: '11px 14px',
                background: 'rgba(255,252,248,0.08)',
                border: '1px solid rgba(255,252,248,0.15)',
                borderRight: 'none',
                borderRadius: '6px 0 0 6px',
                color: 'white', fontSize: '0.85rem', outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--color-copper)', border: 'none',
                padding: '11px 16px', cursor: 'pointer',
                color: 'white', borderRadius: '0 6px 6px 0',
                display: 'flex', alignItems: 'center',
                transition: 'background 0.2s ease',
              }}
              aria-label="Subscribe to newsletter"
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-copper-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-copper)'}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,252,248,0.08)',
        padding: '20px 24px',
        maxWidth: 1400, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'space-between', gap: 12
      }}>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,252,248,0.4)' }}>
          © {new Date().getFullYear()} Friday Morning International. All rights reserved.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,252,248,0.4)' }}>
          Crafted with care in Moradabad, India 🇮🇳
        </p>
      </div>
    </footer>
  )
}
