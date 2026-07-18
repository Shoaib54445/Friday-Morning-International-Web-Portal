import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadImage, deleteCloudinaryImages } from '../../lib/cloudinary'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react'

const EMPTY_FORM = {
  name: '', slug: '', category_id: '', description: '', price: '',
  discount_price: '', is_trending: false, is_active: true, stock_status: 'in_stock',
  specifications: []
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [images, setImages] = useState([]) // { id?, cloudinary_url, cloudinary_public_id, sort_order, is_primary, file? }
  const [removedImageTargets, setRemovedImageTargets] = useState([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filterCat, setFilterCat] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, category:categories(name, slug), images:product_images(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ])
    setProducts(prods || [])
    setCategories(cats || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const openCreate = () => { setForm(EMPTY_FORM); setImages([]); setRemovedImageTargets([]); setEditId(null); setModal(true) }

  const openEdit = (p) => {
    setForm({
      name: p.name, slug: p.slug, category_id: p.category_id || '',
      description: p.description || '', price: p.price, discount_price: p.discount_price || '',
      is_trending: p.is_trending, is_active: p.is_active, stock_status: p.stock_status || 'in_stock',
      specifications: Array.isArray(p.specifications) ? p.specifications : [],
    })
    setImages(([...(p.images || [])].sort((a, b) => a.sort_order - b.sort_order)))
    setRemovedImageTargets([])
    setEditId(p.id); setModal(true)
  }

  // ── Spec helpers ────────────────────────────────────────────────────────────
  const addSpec    = () => setForm(f => ({ ...f, specifications: [...f.specifications, { label: '', value: '' }] }))
  const removeSpec = (idx) => setForm(f => ({ ...f, specifications: f.specifications.filter((_, i) => i !== idx) }))
  const updateSpec = (idx, key, val) => setForm(f => ({
    ...f,
    specifications: f.specifications.map((s, i) => i === idx ? { ...s, [key]: val } : s)
  }))

  const handleImageUpload = async (files) => {
    setUploading(true)
    try {
      const uploads = await Promise.all(
        Array.from(files).map(f => uploadImage(f, 'friday-morning/products'))
      )
      const newImgs = uploads.map((u, i) => ({
        cloudinary_url: u.url,
        cloudinary_public_id: u.publicId,
        sort_order: images.length + i,
        is_primary: images.length === 0 && i === 0,
      }))
      setImages(prev => [...prev, ...newImgs])
      toast.success(`${uploads.length} image${uploads.length > 1 ? 's' : ''} uploaded!`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx) => {
    const target = images[idx]
    if (target?.cloudinary_public_id || target?.cloudinary_url) {
      setRemovedImageTargets(prev => [...prev, target.cloudinary_public_id || target.cloudinary_url])
    }
    setImages(prev => {
      const next = prev.filter((_, i) => i !== idx)
      // If the primary was removed, make the first one primary
      if (!next.some(img => img.is_primary) && next.length > 0) next[0].is_primary = true
      return next
    })
  }

  const setPrimary = (idx) => {
    setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === idx })))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) { toast.error('Name and price are required.'); return }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        category_id: form.category_id || null,
        description: form.description || null,
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        is_trending: form.is_trending,
        is_active: form.is_active,
        stock_status: form.stock_status,
        specifications: form.specifications.filter(s => s.label?.trim() && s.value?.trim()),
      }

      let productId = editId
      if (editId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editId)
        if (error) throw error
        // Replace all images
        await supabase.from('product_images').delete().eq('product_id', editId)
      } else {
        const { data, error } = await supabase.from('products').insert(payload).select().single()
        if (error) throw error
        productId = data.id
      }

      // Insert images
      if (images.length > 0) {
        const imgRows = images.map((img, i) => ({
          product_id: productId,
          cloudinary_url: img.cloudinary_url,
          cloudinary_public_id: img.cloudinary_public_id || null,
          sort_order: i,
          is_primary: img.is_primary,
        }))
        const { error: imgErr } = await supabase.from('product_images').insert(imgRows)
        if (imgErr) throw imgErr
      }

      // Delete removed images from Cloudinary
      if (removedImageTargets.length > 0) {
        deleteCloudinaryImages(removedImageTargets)
        setRemovedImageTargets([])
      }

      toast.success(editId ? 'Product updated!' : 'Product created!')
      setModal(false); fetchAll()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This will also remove all its images.`)) return
    const pToDelete = products.find(p => p.id === id)
    const imageTargets = (pToDelete?.images || [])
      .map(img => img.cloudinary_public_id || img.cloudinary_url)
      .filter(Boolean)

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      if (imageTargets.length > 0) {
        deleteCloudinaryImages(imageTargets)
      }
      toast.success('Product deleted.'); fetchAll()
    }
  }

  const filtered = filterCat ? products.filter(p => p.category_id === filterCat) : products

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-bronze)' }}>Products</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: 4 }}>{products.length} products</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-charcoal)', background: 'white' }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}><div className="skeleton" style={{ height: 20, width: '50%', margin: '0 auto' }} /></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Trending</th>
                <th>Active</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const primary = p.images?.find(i => i.is_primary) || p.images?.[0]
                return (
                  <tr key={p.id}>
                    <td>
                      {primary ? (
                        <img src={primary.cloudinary_url} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--color-cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={16} color="var(--color-muted)" />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>{p.category?.name || '—'}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>₹{Number(p.price).toLocaleString('en-IN')}</span>
                      {p.discount_price && (
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginLeft: 4 }}>→ ₹{Number(p.discount_price).toLocaleString('en-IN')}</span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: p.is_trending ? 'var(--color-gold)' : 'var(--color-muted)', fontWeight: 600 }}>
                        {p.is_trending ? '★ Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${p.is_active ? 'status-approved' : 'status-rejected'}`}>
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{p.stock_status?.replace('_', ' ')}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-ghost" onClick={() => openEdit(p)} style={{ padding: '6px 10px' }} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#721c24', padding: '6px 10px', borderRadius: 6 }} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal-content" style={{ maxWidth: 700, padding: 32, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-bronze)' }}>
                {editId ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Product Name *</label>
                  <input className="form-field" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} placeholder="e.g., Stag Head Taper Candle Holder" required />
                </div>
                <div>
                  <label className="form-label">URL Slug</label>
                  <input className="form-field" type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-field" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">— No Category —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-field" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="2499" required />
                </div>
                <div>
                  <label className="form-label">Discount Price (₹) — optional</label>
                  <input className="form-field" type="number" step="0.01" value={form.discount_price} onChange={e => setForm(f => ({ ...f, discount_price: e.target.value }))} placeholder="1999" />
                </div>
                <div>
                  <label className="form-label">Stock Status</label>
                  <select className="form-field" value={form.stock_status} onChange={e => setForm(f => ({ ...f, stock_status: e.target.value }))}>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-field" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description…" style={{ resize: 'vertical' }} />
                </div>

                {/* ── Dynamic Specifications ─────────────────────────────────── */}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-copper)', margin: 0 }}>
                      Specifications (Optional)
                    </p>
                    <button
                      type="button"
                      onClick={addSpec}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: '0.78rem', fontWeight: 600,
                        color: 'var(--color-copper)',
                        background: 'none',
                        border: '1.5px solid var(--color-copper)',
                        borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Plus size={12} /> Add Field
                    </button>
                  </div>

                  {form.specifications.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontStyle: 'italic', padding: '8px 0' }}>
                      No specs yet — click "Add Field" to add material, dimensions, weight, care instructions, or anything else.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {form.specifications.map((spec, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                          <input
                            className="form-field"
                            type="text"
                            placeholder="Label (e.g. Material)"
                            value={spec.label}
                            onChange={e => updateSpec(i, 'label', e.target.value)}
                          />
                          <input
                            className="form-field"
                            type="text"
                            placeholder="Value (e.g. Cast Aluminium)"
                            value={spec.value}
                            onChange={e => updateSpec(i, 'value', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeSpec(i)}
                            title="Remove this spec"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#721c24', padding: '6px 8px', borderRadius: 6, display: 'flex', alignItems: 'center' }}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.is_trending} onChange={e => setForm(f => ({ ...f, is_trending: e.target.checked }))} />
                    Mark as Trending
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                    Active (visible on site)
                  </label>
                </div>
              </div>

              {/* Images section */}
              <div>
                <label className="form-label" style={{ marginBottom: 12 }}>Product Images</label>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', background: 'var(--color-cream-dark)',
                  border: '1.5px dashed var(--color-border)', borderRadius: 8,
                  cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 16
                }}>
                  <Upload size={14} />
                  {uploading ? 'Uploading…' : 'Upload Images (multiple allowed)'}
                  <input type="file" accept="image/*" multiple onChange={e => handleImageUpload(e.target.files)} style={{ display: 'none' }} disabled={uploading} />
                </label>

                {images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {images.map((img, i) => (
                      <div key={i} style={{
                        position: 'relative', width: 100, height: 100,
                        borderRadius: 8, overflow: 'hidden',
                        border: img.is_primary ? '3px solid var(--color-copper)' : '2px solid var(--color-border)',
                      }}>
                        <img src={img.cloudinary_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {img.is_primary && (
                          <div style={{ position: 'absolute', top: 4, left: 4, background: 'var(--color-copper)', color: 'white', fontSize: '0.6rem', fontWeight: 700, padding: '2px 5px', borderRadius: 3 }}>
                            PRIMARY
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 4 }}>
                          {!img.is_primary && (
                            <button type="button" onClick={() => setPrimary(i)} style={{ background: 'rgba(255,252,248,0.9)', border: 'none', borderRadius: 4, padding: '2px 4px', cursor: 'pointer', fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-copper)' }} title="Set as primary">
                              ★
                            </button>
                          )}
                          <button type="button" onClick={() => removeImage(i)} style={{ background: 'rgba(255,252,248,0.9)', border: 'none', borderRadius: 4, padding: '2px 4px', cursor: 'pointer', color: '#721c24' }}>
                            <X size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: 8 }}>
                  Click ★ to set primary image. Primary image shown on product card.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn-primary" disabled={saving || uploading}>
                  {saving ? 'Saving…' : editId ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
