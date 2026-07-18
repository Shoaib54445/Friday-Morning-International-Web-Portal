import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadImage, deleteCloudinaryImages } from '../../lib/cloudinary'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Upload, X, Check, Eye, EyeOff } from 'lucide-react'

const EMPTY_FORM = { name: '', slug: '', cover_image_url: '', cloudinary_public_id: '', show_in_navbar: true, is_featured: false, sort_order: 0 }

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('edit') }
  const openEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, cover_image_url: cat.cover_image_url || '', cloudinary_public_id: cat.cloudinary_public_id || '', show_in_navbar: cat.show_in_navbar, is_featured: cat.is_featured, sort_order: cat.sort_order })
    setEditId(cat.id); setModal('edit')
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { url, publicId } = await uploadImage(file, 'friday-morning/categories')
      // If replacing an existing image, delete the previous image from Cloudinary
      if (form.cover_image_url || form.cloudinary_public_id) {
        deleteCloudinaryImages(form.cloudinary_public_id || form.cover_image_url)
      }
      setForm(f => ({ ...f, cover_image_url: url, cloudinary_public_id: publicId }))
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name) { toast.error('Category name is required.'); return }
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.name) }
    const { error } = editId
      ? await supabase.from('categories').update(payload).eq('id', editId)
      : await supabase.from('categories').insert(payload)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(editId ? 'Category updated!' : 'Category created!')
    setModal(null); fetch()
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? Products in this category will lose their category assignment.`)) return
    const catToDelete = categories.find(c => c.id === id)
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      if (catToDelete?.cloudinary_public_id || catToDelete?.cover_image_url) {
        deleteCloudinaryImages(catToDelete.cloudinary_public_id || catToDelete.cover_image_url)
      }
      toast.success('Category deleted.'); fetch()
    }
  }

  const toggleFlag = async (id, field, value) => {
    const { error } = await supabase.from('categories').update({ [field]: value }).eq('id', id)
    if (error) toast.error(error.message)
    else { setCategories(c => c.map(cat => cat.id === id ? { ...cat, [field]: value } : cat)) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-bronze)' }}>Categories</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: 4 }}>{categories.length} categor{categories.length === 1 ? 'y' : 'ies'}</p>
        </div>
        <button className="btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}><div className="skeleton" style={{ height: 20, width: '50%', margin: '0 auto' }} /></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Name</th>
                <th>Slug</th>
                <th>In Navbar</th>
                <th>Featured</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    {cat.cover_image_url ? (
                      <img src={cat.cover_image_url} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--color-cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--color-muted)' }}>No img</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--color-bronze)' }}>{cat.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-muted)' }}>{cat.slug}</td>
                  <td>
                    <button
                      onClick={() => toggleFlag(cat.id, 'show_in_navbar', !cat.show_in_navbar)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: cat.show_in_navbar ? 'var(--color-copper)' : 'var(--color-muted)' }}
                      title={cat.show_in_navbar ? 'Shown in navbar — click to hide' : 'Hidden from navbar — click to show'}
                    >
                      {cat.show_in_navbar ? <Check size={18} /> : <X size={18} />}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleFlag(cat.id, 'is_featured', !cat.is_featured)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: cat.is_featured ? 'var(--color-gold)' : 'var(--color-muted)' }}
                      title={cat.is_featured ? 'Featured — click to unfeature' : 'Not featured — click to feature'}
                    >
                      {cat.is_featured ? <Check size={18} /> : <X size={18} />}
                    </button>
                  </td>
                  <td style={{ color: 'var(--color-muted)' }}>{cat.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-ghost" onClick={() => openEdit(cat)} style={{ padding: '6px 10px' }} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#721c24', padding: '6px 10px', borderRadius: 6 }}
                        title="Delete"
                      >
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

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal-content" style={{ maxWidth: 540, padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-bronze)' }}>
                {editId ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="form-label">Category Name *</label>
                <input
                  className="form-field" type="text" placeholder="e.g., Candle Holders"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <label className="form-label">URL Slug</label>
                <input
                  className="form-field" type="text" placeholder="e.g., candle-holders"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label">Cover Image</label>
                {form.cover_image_url && (
                  <img src={form.cover_image_url} alt="" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', marginBottom: 8, display: 'block' }} />
                )}
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', background: 'var(--color-cream-dark)',
                  border: '1.5px dashed var(--color-border)', borderRadius: 6,
                  cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-muted)'
                }}>
                  <Upload size={14} />
                  {uploading ? 'Uploading…' : 'Upload Image to Cloudinary'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label className="form-label">Sort Order</label>
                  <input className="form-field" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
                  <input type="checkbox" id="navbar-check" checked={form.show_in_navbar} onChange={e => setForm(f => ({ ...f, show_in_navbar: e.target.checked }))} />
                  <label htmlFor="navbar-check" style={{ fontSize: '0.85rem', color: 'var(--color-charcoal)' }}>Show in Navbar</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
                  <input type="checkbox" id="featured-check" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
                  <label htmlFor="featured-check" style={{ fontSize: '0.85rem', color: 'var(--color-charcoal)' }}>Featured</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Category'}</button>
                <button type="button" className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
