import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Package, Tag, Star, Mail, TrendingUp, Clock } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, to }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white', borderRadius: 12, padding: '24px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 20,
        transition: 'var(--transition-base)',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
      >
        <div style={{ width: 52, height: 52, borderRadius: 12, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={22} color={color} />
        </div>
        <div>
          <p style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-charcoal)', lineHeight: 1 }}>{value ?? '…'}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: 4 }}>{label}</p>
        </div>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({})
  const [recentContacts, setRecentContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: products },
        { count: categories },
        { count: pendingReviews },
        { count: unreadContacts },
        { data: contacts }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('contact_submissions').select('id, name, email, message, created_at').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({ products, categories, pendingReviews, unreadContacts })
      setRecentContacts(contacts || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-bronze)', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>Welcome back. Here's what's happening with Friday Morning International.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatCard icon={Package} label="Total Products" value={stats.products} color="var(--color-copper)" to="/1972/admin/products" />
        <StatCard icon={Tag} label="Categories" value={stats.categories} color="var(--color-bronze)" to="/1972/admin/categories" />
        <StatCard icon={Star} label="Pending Reviews" value={stats.pendingReviews} color="#D97706" to="/1972/admin/reviews" />
        <StatCard icon={Mail} label="Unread Leads" value={stats.unreadContacts} color="#2563EB" to="/1972/admin/contact" />
      </div>

      {/* Recent contacts */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-bronze)' }}>
            Recent Contact Submissions
          </h2>
          <Link to="/1972/admin/contact" style={{ fontSize: '0.8rem', color: 'var(--color-copper)' }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <div className="skeleton" style={{ height: 16, width: '60%', margin: '0 auto' }} />
            </div>
          ) : recentContacts.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>No contact submissions yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td>{c.email}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                    <td style={{ color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
