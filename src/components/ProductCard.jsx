import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, Heart, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QuickViewModal from './QuickViewModal'

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3 h-3 ${s <= rating ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

export default function ProductCard({ product, className = '' }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const navigate = useNavigate()

  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const secondaryImage = product.images?.find(img => !img.is_primary) || product.images?.[1]

  const hasDiscount = product.discount_price && product.discount_price < product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : null
  const displayPrice = hasDiscount ? product.discount_price : product.price

  const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`

  return (
    <>
      <div
        className={`product-card group ${className}`}
        role="article"
        aria-label={product.name}
      >
        {/* Image container — clicking anywhere on the image navigates to product page */}
        <div
          className="product-card-image-wrap"
          onClick={() => navigate(`/product/${product.slug}`)}
          style={{ cursor: 'pointer' }}
        >
          {/* Primary image */}
          <div className="img-primary absolute inset-0" style={{ background: 'var(--color-cream)' }}>
            <img
              src={primaryImage?.cloudinary_url || `https://placehold.co/800x1000/FAF7F2/D4A853?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
            />
          </div>
          {/* Secondary image (shown on hover) */}
          {secondaryImage && (
            <div className="img-hover" style={{ background: 'var(--color-cream)' }}>
              <img
                src={secondaryImage.cloudinary_url}
                alt={`${product.name} — alternate view`}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div
              style={{
                position: 'absolute', top: 12, left: 12,
                background: 'var(--color-copper)', color: 'white',
                fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px',
                borderRadius: '4px', letterSpacing: '0.05em'
              }}
            >
              {discountPct}% OFF
            </div>
          )}

          {/* Action overlay */}
          <div className="product-card-overlay">
            <button
              className="product-card-action-btn"
              style={{ transitionDelay: '0.05s' }}
              onClick={(e) => { e.stopPropagation(); setWishlisted(w => !w) }}
              aria-label="Add to wishlist"
              title="Add to wishlist"
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              className="product-card-action-btn"
              onClick={(e) => { e.stopPropagation(); setQuickViewOpen(true) }}
              aria-label="Quick view"
              title="Quick view"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Card body */}
        <div
          className="product-card-body"
          onClick={() => navigate(`/product/${product.slug}`)}
          style={{ cursor: 'pointer' }}
        >
          {product.category && (
            <p className="product-category-tag">{product.category.name}</p>
          )}
          <h3 className="product-name">{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
            <span className="product-price">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <span className="product-price-original">{formatPrice(product.price)}</span>
            )}
            {hasDiscount && (
              <span className="product-price-discount">{discountPct}% off</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewOpen && (
          <QuickViewModal
            product={product}
            onClose={() => setQuickViewOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
