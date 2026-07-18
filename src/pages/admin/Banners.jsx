import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadImage, deleteCloudinaryImages } from '../../lib/cloudinary'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Upload, X, Eye, EyeOff } from 'lucide-react'

const EMPTY_FORM = { cloudinary_url: '', cloudinary_public_id: '', headline: '', subheadline: '', cta_text: '', cta_link: '', sort_order: 0, is_active: true }

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const { data } = await supabase.from('banners').select('*').order('sort_order')
    setBanners(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal(true) }
  const openEdit = (b) => {
    setForm({ cloudinary_url: b.cloudinary_url, cloudinary_public_id: b.cloudinary_public_id || '', headline: b.headline || '', subheadline: b.subheadline || '', cta_text: b.cta_text || '', cta_link: b.cta_link || '', sort_order: b.sort_order, is_active: b.is_active })
    setEditId(b.id); setModal(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { url, publicId } = await uploadImage(file, 'friday-morning/banners')
      if (form.cloudinary_url || form.cloudinary_public_id) {
        deleteCloudinaryImages(form.cloudinary_public_id || form.cloudinary_url)
      }
      setForm(f => ({ ...f, cloudinary_url: url, cloudinary_public_id: publicId }))
      toast.success('Banner image uploaded!')
    } catch (err) {
      toast.error(err.message)
    } finally { setUploading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.cloudinary_url) { toast.error('Please upload a banner image.'); return }
    setSaving(true)
    const { error } = editId
      ? await supabase.from('banners').update(form).eq('id', editId)
      : await supabase.from('banners').insert(form)
    setSaving(false)
    if (error) toast.error(error.message)
    else { toast.success(editId ? 'Banner updated!' : 'Banner created!'); setModal(false); fetch() }
  }

  const toggleActive = async (id, is_active) => {
    const { error } = await supabase.from('banners').update({ is_active }).eq('id', id)
    if (error) toast.error(error.message)
    else setBanners(b => b.map(ban => ban.id === id ? { ...ban, is_active } : ban))
  }

  const del = async (id) => {
    if (!confirm('Delete this banner?')) return
    const bannerToDelete = banners.find(b => b.id === id)
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      if (bannerToDelete?.cloudinary_public_id || bannerToDelete?.cloudinary_url) {
        deleteCloudinaryImages(bannerToDelete.cloudinary_public_id || bannerToDelete.cloudinary_url)
      }
      toast.success('Banner deleted.'); fetch()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-bronze)' }}>Hero Banners</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: 4 }}>Manage hero slideshow images and text overlays</p>
        </div>
        <button className="btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> New Banner
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 12 }} />)
        ) : (
          banners.map(b => (
            <div key={b.id} style={{
              background: 'white', borderRadius: 12, overflow: 'hidden',
              boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)',
              opacity: b.is_active ? 1 : 0.6,
            }}>
              <div style={{ position: 'relative', aspectRatio: '16/7', background: 'var(--color-cream-dark)' }}>
                <img src={b.cloudinary_url} alt={b.headline || 'Banner'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                  <button onClick={() => toggleActive(b.id, !b.is_active)} style={{ background: 'rgba(255,252,248,0.9)', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                    {b.is_active ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
                  </button>
                </div>
                {!b.is_active && (
                  <div style={{ position: 'absolute', top: 8, left: 8, background: '#f8d7da', color: '#721c24', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>HIDDEN</div>
                )}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-bronze)', marginBottom: 4, fontSize: '0.95rem' }}>
                  {b.headline || '(no headline)'}
                </p>
                {b.cta_text && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-copper)', marginBottom: 8 }}>CTA: {b.cta_text} → {b.cta_link}</p>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-ghost" onClick={() => openEdit(b)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => del(b.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#721c24', padding: '6px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal-content" style={{ maxWidth: 560, padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-bronze)' }}>{editId ? 'Edit Banner' : 'New Banner'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="form-label">Banner Image *</label>
                {form.cloudinary_url && (
                  <img src={form.cloudinary_url} alt="" style={{ width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
                )}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: 'var(--color-cream-dark)', border: '1.5px dashed var(--color-border)', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                  <Upload size={14} />
                  {uploading ? 'Uploading…' : 'Upload Banner to Cloudinary'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
              </div>
              <div>
                <label className="form-label">Headline</label>
                <input className="form-field" type="text" value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="e.g., The Art of the Everyday" />
              </div>
              <div>
                <label className="form-label">Subheadline</label>
                <input className="form-field" type="text" value={form.subheadline} onChange={e => setForm(f => ({ ...f, subheadline: e.target.value }))} placeholder="Short supporting tagline" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">CTA Button Text</label>
                  <input className="form-field" type="text" value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} placeholder="Explore Collection" />
                </div>
                <div>
                  <label className="form-label">CTA Link</label>
                  <input className="form-field" type="text" value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} placeholder="/category/candle-holders" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center' }}>
                <div>
                  <label className="form-label">Sort Order</label>
                  <input className="form-field" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
                </div>
                <div style={{ paddingTop: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                    Active (shown on site)
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn-primary" disabled={saving || uploading}>{saving ? 'Saving…' : editId ? 'Update Banner' : 'Create Banner'}</button>
                <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
