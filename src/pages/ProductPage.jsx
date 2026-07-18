import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Share2, Heart } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import { useProduct } from '../hooks/useData'
import { Star } from 'lucide-react'
import EnquiryModal from '../components/EnquiryModal'

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={16} fill={s <= rating ? 'var(--color-gold)' : 'none'} color={s <= rating ? 'var(--color-gold)' : 'var(--color-border)'} />
      ))}
    </div>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  const { product, loading, error } = useProduct(slug)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [wishlisted, setWishlisted] = useState(false)
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  if (loading) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px clamp(16px, 5vw, 80px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div className="skeleton" style={{ aspectRatio: '4/5', borderRadius: 12 }} />
          <div style={{ paddingTop: 16 }}>
            <div className="skeleton" style={{ height: 16, width: '30%', marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 40, width: '80%', marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 24, width: '25%', marginBottom: 32 }} />
            <div className="skeleton" style={{ height: 120, marginBottom: 24 }} />
            <div className="skeleton" style={{ height: 48, borderRadius: 6 }} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-bronze)', marginBottom: 16 }}>
          Product Not Found
        </h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: 28 }}>
          This piece may no longer be available or the link might be incorrect.
        </p>
        <Link to="/" className="btn-primary">← Return Home</Link>
      </div>
    )
  }

  const hasDiscount = product.discount_price && product.discount_price < product.price
  const discountPct = hasDiscount ? Math.round((1 - product.discount_price / product.price) * 100) : null
  const displayPrice = hasDiscount ? product.discount_price : product.price
  const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`

  const stockLabel = {
    in_stock:     { text: 'In Stock',         color: 'var(--color-copper)' },
    low_stock:    { text: 'Only a Few Left',  color: '#B45309' },
    out_of_stock: { text: 'Out of Stock',     color: '#721c24' },
  }[product.stock_status || 'in_stock']

  // Dynamic specifications from JSONB — only show rows with both label and value
  const dynamicSpecs = Array.isArray(product.specifications)
    ? product.specifications.filter(s => s.label?.trim() && s.value?.trim())
    : []


  return (
    <>
      <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--color-cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px clamp(16px, 5vw, 80px) 80px' }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={12} color="var(--color-muted)" />
            {product.category && (
              <>
                <Link to={`/category/${product.category.slug}`} style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textDecoration: 'none' }}>
                  {product.category.name}
                </Link>
                <ChevronRight size={12} color="var(--color-muted)" />
              </>
            )}
            <span style={{ fontSize: '0.8rem', color: 'var(--color-copper)' }}>{product.name}</span>
          </nav>

          {/* Main layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(32px, 5vw, 64px)', alignItems: 'start'
          }}>
            {/* Image gallery */}
            <div>
              {/* Main swiper — Item 3: object-fit:contain so full image shows */}
              <div style={{
                borderRadius: 16, overflow: 'hidden',
                background: 'var(--color-cream)',
                boxShadow: 'var(--shadow-card)',
                marginBottom: 12,
              }}>
                {product.images && product.images.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    navigation
                    pagination={{ clickable: true }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    style={{ aspectRatio: '4/5' }}
                  >
                    {product.images.map(img => (
                      <SwiperSlide key={img.id} style={{ background: 'var(--color-cream)' }}>
                        <img
                          src={img.cloudinary_url}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div style={{ aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
                    No images available
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={Math.min(product.images.length, 5)}
                  watchSlidesProgress
                  style={{ height: 72 }}
                >
                  {product.images.map(img => (
                    <SwiperSlide key={img.id} style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', background: 'var(--color-cream)' }}>
                      <img
                        src={img.cloudinary_url}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', borderRadius: 8 }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Product info */}
            <div className="product-info-sticky" style={{ position: 'sticky', top: 96 }}>
              {product.category && (
                <Link
                  to={`/category/${product.category.slug}`}
                  className="product-category-tag"
                  style={{ textDecoration: 'none', display: 'block', marginBottom: 10 }}
                >
                  {product.category.name}
                </Link>
              )}

              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                color: 'var(--color-bronze)',
                lineHeight: 1.2, marginBottom: 20
              }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span style={{ color: 'var(--color-muted)', textDecoration: 'line-through', fontSize: '1.1rem' }}>
                      {formatPrice(product.price)}
                    </span>
                    <span style={{ background: '#d4edda', color: '#155724', fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: 999 }}>
                      {discountPct}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: stockLabel.color, letterSpacing: '0.05em', marginBottom: 24 }}>
                ● {stockLabel.text}
              </p>

              {/* Description */}
              {product.description && (
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-mid)', lineHeight: 1.8 }}>
                    {product.description}
                  </p>
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />

              {/* Static craft details (always shown) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Craft',  value: 'Hand-cast & hand-finished' },
                  { label: 'Origin', value: 'Moradabad, India' },
                  { label: 'SKU',    value: product.slug.toUpperCase().slice(0, 12) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-charcoal)' }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Item 8: Dynamic specifications — only rendered when values are set in admin */}
              {dynamicSpecs.length > 0 && (
                <>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-copper)', marginBottom: 12, marginTop: 4 }}>
                    Specifications
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
                    {dynamicSpecs.map(({ label, value }) => (
                      <div key={label} style={{ padding: '10px 12px', background: 'var(--color-cream)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: 3 }}>{label}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal)', lineHeight: 1.4 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Item 7: CTAs — Enquire button opens modal */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}
                  onClick={() => setEnquiryOpen(true)}
                >
                  Enquire About This Piece
                </button>
                <button
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px' }}
                  onClick={() => setWishlisted(w => !w)}
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                  {wishlisted ? 'Saved' : 'Wishlist'}
                </button>
              </div>

              {/* Trust badges */}
              <div style={{
                marginTop: 28, padding: '16px 20px',
                background: 'var(--color-cream)',
                borderRadius: 10, border: '1px solid var(--color-border)',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 12,
              }}>
                {[
                  { icon: '🛡️', text: 'Authentic Handmade' },
                  { icon: '📦', text: 'Careful Packaging' },
                  { icon: '💬', text: '24hr Response' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{icon}</div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', lineHeight: 1.3 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item 7: Enquiry modal — rendered outside the scrollable container */}
      {enquiryOpen && (
        <EnquiryModal product={product} onClose={() => setEnquiryOpen(false)} />
      )}
    </>
  )
}
