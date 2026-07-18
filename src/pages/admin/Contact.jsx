import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Trash2, Mail, Phone, BellOff, Bell, Package } from 'lucide-react'

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'unread' | 'read'
  const [expanded, setExpanded] = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    let q = supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    if (filter === 'unread') q = q.eq('is_read', false)
    if (filter === 'read')   q = q.eq('is_read', true)
    const { data } = await q
    setSubmissions(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [filter])

  const markRead = async (id, is_read) => {
    const { error } = await supabase.from('contact_submissions').update({ is_read }).eq('id', id)
    if (error) toast.error(error.message)
    else setSubmissions(s => s.map(sub => sub.id === id ? { ...sub, is_read } : sub))
  }

  const del = async (id) => {
    if (!confirm('Delete this submission?')) return
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Submission deleted.'); fetchAll() }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-bronze)' }}>Contact Leads</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: 4 }}>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', background: filter === f ? 'var(--color-copper)' : 'white',
              color: filter === f ? 'white' : 'var(--color-charcoal-mid)',
              border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, textTransform: 'capitalize',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)
        ) : submissions.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 12, padding: '60px', textAlign: 'center', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
            <Mail size={32} color="var(--color-muted)" style={{ marginBottom: 12 }} />
            <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>No contact submissions yet.</p>
          </div>
        ) : (
          submissions.map(sub => (
            <div key={sub.id} style={{
              background: 'white', borderRadius: 12,
              boxShadow: 'var(--shadow-card)',
              border: `1px solid ${sub.is_read ? 'var(--color-border)' : 'var(--color-copper)'}`,
              overflow: 'hidden',
              opacity: sub.is_read ? 0.85 : 1,
            }}>
              <div
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', flexWrap: 'wrap' }}
                onClick={() => { setExpanded(expanded === sub.id ? null : sub.id); if (!sub.is_read) markRead(sub.id, true) }}
              >
                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: sub.is_read ? 'var(--color-cream-dark)' : 'var(--color-copper)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: sub.is_read ? 'var(--color-muted)' : 'white',
                  fontFamily: 'var(--font-serif)', fontWeight: 700, flexShrink: 0,
                }}>
                  {sub.name?.[0] || '?'}
                </div>

                {/* Name + badges */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{sub.name}</span>

                    {/* NEW badge — unread */}
                    {!sub.is_read && (
                      <span style={{ background: 'var(--color-copper)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>
                        NEW
                      </span>
                    )}

                    {/* Inquiry type badge */}
                    {sub.inquiry_type === 'product_enquiry' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>
                        <Package size={9} /> Product Enquiry
                      </span>
                    )}

                    {/* notification_sent badge — key auditability feature */}
                    {sub.notification_sent === false && (
                      <span
                        title="No notification email was sent for this submission (duplicate within 24h window)"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: '#FEF3C7', color: '#92400E', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}
                      >
                        <BellOff size={9} /> No email sent
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: 2 }}>
                    {sub.email}{sub.phone ? ` · ${sub.phone}` : ''}
                  </p>
                </div>

                {/* Date */}
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(sub.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={e => { e.stopPropagation(); markRead(sub.id, !sub.is_read) }}
                    title={sub.is_read ? 'Mark unread' : 'Mark read'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 4 }}
                  >
                    {sub.is_read ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); del(sub.id) }}
                    title="Delete"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#721c24', padding: 4 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === sub.id && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-cream-dark)', background: 'var(--color-cream)' }}>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 12, flexWrap: 'wrap' }}>
                    {sub.email && (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&to=${sub.email}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--color-copper)' }}
                      >
                        <Mail size={14} /> {sub.email}
                      </a>
                    )}
                    {sub.phone && (
                      <a href={`tel:${sub.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--color-copper)' }}>
                        <Phone size={14} /> {sub.phone}
                      </a>
                    )}
                    {/* Notification status in expanded view */}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: sub.notification_sent !== false ? '#047857' : '#92400E' }}>
                      {sub.notification_sent !== false
                        ? <><Bell size={12} /> Notification email sent</>
                        : <><BellOff size={12} /> No notification email (duplicate 24h window)</>
                      }
                    </span>
                  </div>
                  {sub.message ? (
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-mid)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{sub.message}</p>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>(No message provided)</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
