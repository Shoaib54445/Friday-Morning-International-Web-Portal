import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Check, X, Trash2, Star, Plus } from 'lucide-react'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState({ customer_name: '', rating: 5, review_text: '' })
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    let q = supabase.from('reviews').select('*, product:products(name)').order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setReviews(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [filter])

  const setStatus = async (id, status) => {
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success(`Review ${status}.`); fetch() }
  }

  const del = async (id) => {
    if (!confirm('Delete this review permanently?')) return
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Review deleted.'); fetch() }
  }

  const handleAddReview = async (e) => {
    e.preventDefault()
    if (!addForm.customer_name || !addForm.review_text) { toast.error('Fill in all fields.'); return }
    setSaving(true)
    const { error } = await supabase.from('reviews').insert({ ...addForm, status: 'approved' })
    setSaving(false)
    if (error) toast.error(error.message)
    else { toast.success('Review added!'); setShowAddForm(false); setAddForm({ customer_name: '', rating: 5, review_text: '' }); fetch() }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-bronze)' }}>Reviews</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: 4 }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''} ({filter})</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 14px', background: filter === f ? 'var(--color-copper)' : 'white',
                color: filter === f ? 'white' : 'var(--color-charcoal-mid)',
                border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                textTransform: 'capitalize',
              }}>
                {f}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setShowAddForm(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> Add Curated Review
          </button>
        </div>
      </div>

      {showAddForm && (
        <div style={{ background: 'white', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-bronze)', marginBottom: 20 }}>Add Curated Review</h3>
          <form onSubmit={handleAddReview} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Customer Name *</label>
              <input className="form-field" value={addForm.customer_name} onChange={e => setAddForm(f => ({ ...f, customer_name: e.target.value }))} placeholder="Priya Sharma" />
            </div>
            <div>
              <label className="form-label">Rating (1–5)</label>
              <input className="form-field" type="number" min={1} max={5} value={addForm.rating} onChange={e => setAddForm(f => ({ ...f, rating: +e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Review Text *</label>
              <textarea className="form-field" rows={3} value={addForm.review_text} onChange={e => setAddForm(f => ({ ...f, review_text: e.target.value }))} placeholder="The customer's review…" style={{ resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Add Review'}</button>
              <button type="button" className="btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}><div className="skeleton" style={{ height: 20, width: '50%', margin: '0 auto' }} /></div>
        ) : reviews.length === 0 ? (
          <p style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted)' }}>No reviews found for this filter.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Product</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.customer_name}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} fill={s <= r.rating ? 'var(--color-gold)' : 'none'} color={s <= r.rating ? 'var(--color-gold)' : 'var(--color-border)'} />
                      ))}
                    </div>
                  </td>
                  <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-charcoal-mid)', fontSize: '0.85rem' }}>
                    {r.review_text}
                  </td>
                  <td style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>{r.product?.name || '—'}</td>
                  <td>
                    <span className={`status-badge status-${r.status}`}>{r.status}</span>
                  </td>
                  <td style={{ color: 'var(--color-muted)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.status !== 'approved' && (
                        <button onClick={() => setStatus(r.id, 'approved')} title="Approve" style={{ background: '#d4edda', border: 'none', borderRadius: 6, padding: '6px', cursor: 'pointer', color: '#155724' }}>
                          <Check size={14} />
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button onClick={() => setStatus(r.id, 'rejected')} title="Reject" style={{ background: '#f8d7da', border: 'none', borderRadius: 6, padding: '6px', cursor: 'pointer', color: '#721c24' }}>
                          <X size={14} />
                        </button>
                      )}
                      <button onClick={() => del(r.id)} title="Delete" style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: '#721c24', borderRadius: 6 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
