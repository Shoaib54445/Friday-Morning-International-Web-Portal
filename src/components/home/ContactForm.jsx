import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactForm() {
  // Name + Email required · Phone + Message optional
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) {
      e.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Please enter a valid email address (e.g. name@example.com)'
    }
    if (form.phone.trim()) {
      let digits = form.phone.replace(/\D/g, '')
      if (digits.length === 12 && digits.startsWith('91')) {
        digits = digits.slice(2)
      } else if (digits.length === 11 && digits.startsWith('0')) {
        digits = digits.slice(1)
      }
      if (digits.length !== 10) e.phone = 'Phone number must be exactly 10 digits'
    }
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
          email:        form.email.trim(),
          phone:        form.phone.trim() || null,
          message:      form.message.trim() || null,
          inquiry_type: 'general',
        },
      })

      if (error) throw new Error(error.message || 'Submission failed')

      if (data?.isDuplicate) {
        toast(data.message, { icon: '💌', duration: 6000 })
      } else {
        toast.success(data?.message || "Message sent! We'll be in touch within 24 hours.")
      }
      setForm({ name: '', email: '', phone: '', message: '' })
      setErrors({})
    } catch (err) {
      toast.error('Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (key) => ({
    value: form[key],
    onChange: e => {
      setForm(f => ({ ...f, [key]: e.target.value }))
      if (errors[key]) setErrors(err => ({ ...err, [key]: undefined }))
    },
  })

  return (
    <section
      id="contact"
      style={{
        padding: 'clamp(48px, 8vw, 96px) clamp(16px, 5vw, 80px)',
        background: 'var(--color-cream-dark)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="section-label" style={{ marginBottom: 12 }}>We'd Love to Hear From You</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: 'var(--color-bronze)' }}>
            Contact Us
          </h2>
          <p style={{ color: 'var(--color-muted)', marginTop: 12, maxWidth: 480, margin: '12px auto 0', fontSize: '0.95rem' }}>
            Enquire about a piece, request a catalogue, or simply say hello — our team responds within one business day.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 48, alignItems: 'start',
        }}>
          {/* Contact info */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Visit */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-warm-white)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-copper)', flexShrink: 0 }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-bronze)', marginBottom: 4 }}>Visit Us</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>Friday Morning International</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>Moradabad, Uttar Pradesh — 244001</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>India</p>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-warm-white)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-copper)', flexShrink: 0 }}>
                  <Phone size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-bronze)', marginBottom: 4 }}>Call Us</p>
                  <a href="tel:+919897754310" style={{ fontSize: '0.85rem', color: 'var(--color-muted)', textDecoration: 'none', display: 'block', lineHeight: 1.6, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-copper)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
                  >
                    +91 98977 54310
                  </a>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>Mon–Sat, 10am–7pm IST</p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-warm-white)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-copper)', flexShrink: 0 }}>
                  <Mail size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-bronze)', marginBottom: 4 }}>Email Us</p>
                  <a href="https://mail.google.com/mail/?view=cm&to=info@fridaymorning.in"
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '0.85rem', color: 'var(--color-muted)', textDecoration: 'none', display: 'block', lineHeight: 1.6, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-copper)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
                  >
                    info@fridaymorning.in
                  </a>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>We reply within 24 hours</p>
                </div>
              </div>

              {/* Hours */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-warm-white)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-copper)', flexShrink: 0 }}>
                  <Clock size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-bronze)', marginBottom: 4 }}>Business Hours</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>Monday–Friday: 10am – 7pm IST</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>Saturday: 11am – 5pm IST</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div style={{ marginTop: 32, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <iframe
                title="Friday Morning International — Location"
                src="https://maps.google.com/maps?q=28.828225,78.781980&z=15&output=embed"
                width="100%"
                height="220"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact form */}
          <div style={{
            background: 'var(--color-warm-white)',
            borderRadius: 16, padding: '36px',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-bronze)', marginBottom: 28 }}>
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'grid', gap: 20 }}>

                {/* Name — required */}
                <div>
                  <label className="form-label" htmlFor="contact-name">Your Name *</label>
                  <input
                    id="contact-name" type="text" className="form-field"
                    placeholder="e.g., Priya Sharma"
                    {...field('name')}
                    aria-invalid={!!errors.name}
                    style={errors.name ? { borderColor: '#721c24' } : {}}
                  />
                  {errors.name && <p style={{ color: '#721c24', fontSize: '0.75rem', marginTop: 4 }}>{errors.name}</p>}
                </div>

                {/* Email — required */}
                <div>
                  <label className="form-label" htmlFor="contact-email">Email Address *</label>
                  <input
                    id="contact-email" type="email" className="form-field"
                    placeholder="you@example.com"
                    {...field('email')}
                    aria-invalid={!!errors.email}
                    style={errors.email ? { borderColor: '#721c24' } : {}}
                  />
                  {errors.email && <p style={{ color: '#721c24', fontSize: '0.75rem', marginTop: 4 }}>{errors.email}</p>}
                </div>

                {/* Phone — optional, 10 digits if provided */}
                <div>
                  <label className="form-label" htmlFor="contact-phone">Phone <span style={{ fontWeight: 400, color: 'var(--color-muted)' }}>(Optional)</span></label>
                  <input
                    id="contact-phone" type="tel" className="form-field"
                    placeholder="e.g. 98765 43210"
                    {...field('phone')}
                    aria-invalid={!!errors.phone}
                    style={errors.phone ? { borderColor: '#721c24' } : {}}
                  />
                  {errors.phone && <p style={{ color: '#721c24', fontSize: '0.75rem', marginTop: 4 }}>{errors.phone}</p>}
                </div>

                {/* Message — optional */}
                <div>
                  <label className="form-label" htmlFor="contact-message">
                    Your Message <span style={{ fontWeight: 400, color: 'var(--color-muted)' }}>(Optional)</span>
                  </label>
                  <textarea
                    id="contact-message" className="form-field" rows={5}
                    placeholder="Tell us what you're looking for, ask about a piece, or just say hello..."
                    {...field('message')}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit" className="btn-primary"
                  disabled={submitting}
                  style={{ justifyContent: 'center', fontSize: '0.9rem' }}
                >
                  {submitting ? 'Sending…' : 'Send Message'}
                  {!submitting && <Send size={15} />}
                </button>

                <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', textAlign: 'center' }}>
                  We respect your privacy. Your details are never shared with third parties.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
