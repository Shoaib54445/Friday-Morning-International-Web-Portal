import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import EnquiryModal from './EnquiryModal'

function StarRating({ rating }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

export default function QuickViewModal({ product, onClose }) {
  const navigate = useNavigate()
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  const hasDiscount = product.discount_price && product.discount_price < product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : null
  const displayPrice = hasDiscount ? product.discount_price : product.price
  const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`

  return (
    <>
      <motion.div
        className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="modal-content"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
      >

        {/* Image gallery */}
        <div style={{ background: '#F5F0EA', borderRadius: '12px 0 0 12px', overflow: 'hidden', minHeight: 400 }}>
          {product.images && product.images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              style={{ height: '100%', minHeight: 400 }}
            >
              {product.images.map(img => (
                <SwiperSlide key={img.id}>
                  <img
                    src={img.cloudinary_url}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 400 }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{ width: '100%', height: '100%', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--color-muted)' }}>No image</span>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={{ padding: '32px', position: 'relative', overflowY: 'auto' }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'var(--color-cream-dark)', border: 'none',
              borderRadius: '50%', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-charcoal)'
            }}
            aria-label="Close quick view"
          >
            <X size={16} />
          </button>

          {product.category && (
            <p className="product-category-tag" style={{ marginBottom: 8 }}>{product.category.name}</p>
          )}
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-bronze)', marginBottom: 12, lineHeight: 1.25 }}>
            {product.name}
          </h2>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span style={{ color: 'var(--color-muted)', textDecoration: 'line-through', fontSize: '0.95rem' }}>
                  {formatPrice(product.price)}
                </span>
                <span style={{ background: '#d4edda', color: '#155724', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>
                  {discountPct}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-mid)', lineHeight: 1.7, marginBottom: 24 }}>
              {product.description.slice(0, 280)}{product.description.length > 280 ? '…' : ''}
            </p>
          )}

          {/* Stock status */}
          <div style={{ marginBottom: 24 }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: product.stock_status === 'out_of_stock' ? '#721c24' : 'var(--color-copper)'
            }}>
              {product.stock_status === 'in_stock' ? '✓ In Stock' :
               product.stock_status === 'low_stock' ? '⚡ Only a few left' : '✗ Out of Stock'}
            </span>
          </div>

          {/* CTA buttons */}
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
            onClick={() => { onClose(); navigate(`/product/${product.slug}`) }}
          >
            View Full Details <ArrowRight size={16} />
          </button>
          <button
            className="btn-outline"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setEnquiryOpen(true)}
          >
            Enquire About This Piece
          </button>
        </div>
      </motion.div>
    </motion.div>

    {/* Enquiry modal — rendered outside the motion backdrop to avoid z-index conflicts */}
    {enquiryOpen && (
      <EnquiryModal product={product} onClose={() => setEnquiryOpen(false)} />
    )}
  </>
  )
}
