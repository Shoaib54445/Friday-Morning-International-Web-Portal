import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useReviews } from '../../hooks/useData'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { MessageSquarePlus, Star } from 'lucide-react'

function StarRating({ rating, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(s => (
        <button
          key={s}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onRate(s) : undefined}
          onMouseEnter={interactive ? () => setHovered(s) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          style={{
            background: 'none', border: 'none', padding: 2,
            cursor: interactive ? 'pointer' : 'default',
          }}
          aria-label={interactive ? `Rate ${s} out of 5` : undefined}
        >
          <Star
            size={interactive ? 20 : 16}
            fill={s <= (hovered || rating) ? 'var(--color-gold)' : 'none'}
            color={s <= (hovered || rating) ? 'var(--color-gold)' : 'var(--color-border)'}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <div style={{
      background: 'var(--color-warm-white)',
      borderRadius: 12,
      padding: '28px 28px',
      boxShadow: '0 4px 20px rgba(44,36,23,0.07)',
      height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      <StarRating rating={review.rating} />
      <blockquote style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1rem', lineHeight: 1.7,
        color: 'var(--color-charcoal-mid)',
        fontStyle: 'italic',
        margin: '16px 0',
        flex: 1,
      }}>
        "{review.review_text}"
      </blockquote>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {review.photo_url ? (
          <img src={review.photo_url} alt={review.customer_name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--color-copper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1rem'
          }}>
            {review.customer_name[0]}
          </div>
        )}
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-bronze)', marginBottom: 2 }}>
            {review.customer_name}
          </p>
          {review.product?.name && (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>on {review.product.name}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Reviews() {
  const { reviews, loading } = useReviews({ limit: 8 })
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ customer_name: '', rating: 0, review_text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customer_name || !form.rating || !form.review_text) {
      toast.error('Please fill in all fields and select a rating.')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert({
      customer_name: form.customer_name,
      rating: form.rating,
      review_text: form.review_text,
      status: 'pending',
    })
    setSubmitting(false)
    if (error) {
      toast.error('Something went wrong. Please try again.')
    } else {
      toast.success('Thank you! Your review has been submitted for approval.')
      setForm({ customer_name: '', rating: 0, review_text: '' })
      setShowForm(false)
    }
  }

  return (
    <section id="reviews" style={{ padding: 'clamp(48px, 8vw, 96px) clamp(16px, 5vw, 80px)', background: 'var(--color-cream)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>What Our Customers Say</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--color-bronze)' }}>
              Loved Across India
            </h2>
          </div>
          <button
            className="btn-outline"
            onClick={() => setShowForm(f => !f)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <MessageSquarePlus size={16} />
            {showForm ? 'Cancel' : 'Share Your Experience'}
          </button>
        </div>

        {/* Submit review form */}
        {showForm && (
          <div style={{
            background: 'var(--color-warm-white)',
            borderRadius: 12, padding: '32px',
            marginBottom: 40,
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-bronze)', marginBottom: 24 }}>
              Write a Review
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <div>
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-field"
                    value={form.customer_name}
                    onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                    placeholder="e.g., Priya Sharma"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Your Rating *</label>
                  <StarRating rating={form.rating} interactive onRate={r => setForm(f => ({ ...f, rating: r }))} />
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <label className="form-label">Your Review *</label>
                <textarea
                  className="form-field"
                  rows={4}
                  value={form.review_text}
                  onChange={e => setForm(f => ({ ...f, review_text: e.target.value }))}
                  placeholder="Tell us about your experience with our products..."
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', alignSelf: 'center' }}>
                  Reviews are approved before publishing.
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Reviews carousel */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 12 }} />)}
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: 'var(--color-muted)' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
              Be the first to share your experience with Friday Morning International.
            </p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            style={{ paddingBottom: 48 }}
          >
            {reviews.map(review => (
              <SwiperSlide key={review.id} style={{ height: 'auto' }}>
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}
