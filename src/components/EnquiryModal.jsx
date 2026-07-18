import { useState } from 'react'
import { X, Send, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function EnquiryModal({ product, onClose }) {
  const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`
  const displayPrice = product.discount_price && product.discount_price < product.price
    ? product.discount_price
    : product.price

  const defaultMessage = `I am interested in ${product.name} (${formatPrice(displayPrice)}). Please share more details about availability, lead time, and any customisation options.`

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: defaultMessage })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isDuplicate, setIsDuplicate] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() && !form.phone.trim()) e.contact = 'Please provide your email or phone number'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address (e.g. name@example.com)'
    if (form.phone.trim()) {
      let digits = form.phone.replace(/\D/g, '')
      if (digits.length === 12 && digits.startsWith('91')) {
        digits = digits.slice(2)
      } else if (digits.length === 11 && digits.startsWith('0')) {
        digits = digits.slice(1)
      }
      if (digits.length !== 10) e.phone = 'Phone number must be exactly 10 digits'
    }
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-notification', {
        body: {
          name:         form.name.trim(),
          email:        form.email.trim() || null,
          phone:        form.phone.trim() || null,
          message:      form.message.trim(),
          product_id:   product.id,
          inquiry_type: 'product_enquiry',
        },
      })

      if (error) throw new Error(error.message || 'Submission failed')

      setIsDuplicate(data?.isDuplicate ?? false)
      setSubmitted(true)
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        background: 'rgba(44,36,23,0.65)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          background: 'var(--color-warm-white)',
          borderRadius: 16,
          padding: '28px 32px 32px',
          width: '100%', maxWidth: 520,
          maxHeight: '92vh', overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(44,36,23,0.3)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 4, borderRadius: 6 }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {submitted ? (
          /* ── Success State ─────────────────────────────── */
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(184,115,51,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={36} color="var(--color-copper)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-bronze)', marginBottom: 12 }}>
              Enquiry Sent!
            </h3>
            {isDuplicate ? (
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.75, marginBottom: 32, fontSize: '0.9rem' }}>
                Thanks — we've received your message about <strong style={{ color: 'var(--color-charcoal)' }}>{product.name}</strong>.
                Since we already have a recent message from you, our team will review both together and be in touch soon.
              </p>
            ) : (
              <>
                <p style={{ color: 'var(--color-muted)', lineHeight: 1.75, marginBottom: 8, fontSize: '0.95rem' }}>
                  Thank you for your interest in{' '}
                  <strong style={{ color: 'var(--color-charcoal)' }}>{product.name}</strong>.
                </p>
                <p style={{ color: 'var(--color-muted)', lineHeight: 1.75, marginBottom: 32, fontSize: '0.9rem' }}>
                  We'll get back to you at{' '}
                  <strong>{form.email || form.phone}</strong>{' '}
                  within one business day (Mon–Sat).
                </p>
              </>
            )}
            <button onClick={onClose} className="btn-primary" style={{ margin: '0 auto' }}>
              Continue Browsing
            </button>
          </div>
        ) : (
          /* ── Form State ────────────────────────────────── */
          <>
            {/* Product preview */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 24, padding: '14px 16px', background: 'var(--color-cream)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
              {product.images?.[0] && (
                <img
                  src={product.images[0].cloudinary_url}
                  alt={product.name}
                  style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, flexShrink: 0, background: 'white' }}
                />
              )}
              <div style={{ minWidth: 0 }}>
                {product.category && (
                  <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-copper)', marginBottom: 2 }}>
                    {product.category.name}
                  </p>
                )}
                <p style={{ fontWeight: 600, color: 'var(--color-charcoal)', fontSize: '0.9rem', marginBottom: 4, lineHeight: 1.3 }}>{product.name}</p>
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-bronze)', fontWeight: 700, fontSize: '1rem' }}>{formatPrice(displayPrice)}</p>
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-bronze)', marginBottom: 24 }}>
              Enquire About This Piece
            </h3>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Name */}
              <div>
                <label className="form-label" htmlFor="enq-name">Your Name *</label>
                <input
                  id="enq-name" type="text" className="form-field"
                  placeholder="e.g., Priya Sharma"
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); if (errors.name) setErrors(err => ({ ...err, name: undefined })) }}
                  style={errors.name ? { borderColor: '#721c24' } : {}}
                />
                {errors.name && <p style={{ color: '#721c24', fontSize: '0.75rem', marginTop: 4 }}>{errors.name}</p>}
              </div>

              {/* Email + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label" htmlFor="enq-email">Email</label>
                  <input
                    id="enq-email" type="email" className="form-field"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); if (errors.email || errors.contact) setErrors(err => ({ ...err, email: undefined, contact: undefined })) }}
                    style={errors.email ? { borderColor: '#721c24' } : {}}
                  />
                  {errors.email && <p style={{ color: '#721c24', fontSize: '0.7rem', marginTop: 4 }}>{errors.email}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="enq-phone">Phone</label>
                  <input
                    id="enq-phone" type="tel" className="form-field"
                    placeholder="e.g. 98765 43210"
                    value={form.phone}
                    onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); if (errors.contact || errors.phone) setErrors(err => ({ ...err, contact: undefined, phone: undefined })) }}
                    style={errors.phone ? { borderColor: '#721c24' } : {}}
                  />
                  {errors.phone && <p style={{ color: '#721c24', fontSize: '0.7rem', marginTop: 4 }}>{errors.phone}</p>}
                </div>
              </div>
              {errors.contact && <p style={{ color: '#721c24', fontSize: '0.75rem', marginTop: -8 }}>{errors.contact}</p>}
              <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: -12 }}>
                Please provide at least your email or phone number
              </p>

              {/* Message */}
              <div>
                <label className="form-label" htmlFor="enq-message">Message *</label>
                <textarea
                  id="enq-message" className="form-field" rows={4}
                  value={form.message}
                  onChange={e => { setForm(f => ({ ...f, message: e.target.value })); if (errors.message) setErrors(err => ({ ...err, message: undefined })) }}
                  style={{ resize: 'vertical', ...(errors.message ? { borderColor: '#721c24' } : {}) }}
                />
                {errors.message && <p style={{ color: '#721c24', fontSize: '0.75rem', marginTop: 4 }}>{errors.message}</p>}
              </div>

              <button type="submit" className="btn-primary" disabled={submitting} style={{ justifyContent: 'center', fontSize: '0.9rem' }}>
                {submitting ? 'Sending…' : 'Send Enquiry'}
                {!submitting && <Send size={15} />}
              </button>

              <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textAlign: 'center' }}>
                We respond within one business day · Mon–Sat, 10am–7pm IST
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
