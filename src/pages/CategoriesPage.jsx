import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useCategories } from '../hooks/useData'

const CATEGORY_IMAGES = {
  'candle-holders':    '/items/FM130A.png',
  'cake-stands-trays': '/items/FMI 393A.jpg',
  'urlis-bowls':       '/items/Fm968.png',
  'decor-figurines':   '/items/FMI 612A.png',
  'serving-sets':      '/items/Fm960.png',
}

export default function CategoriesPage() {
  const { categories, loading, error } = useCategories()

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* Hero Header */}
      <div style={{
        background: 'var(--color-charcoal)',
        padding: '64px clamp(16px, 5vw, 80px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212,168,83,0.1) 0%, transparent 70%)',
        }} />

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'rgba(255,252,248,0.5)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={12} color="rgba(255,252,248,0.3)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-light)', fontWeight: 500 }}>Categories</span>
        </nav>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          color: 'white',
          marginBottom: 12,
        }}>
          All Categories
        </h1>
        <p style={{ color: 'rgba(255,252,248,0.7)', maxWidth: 540, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Explore our complete range of handcrafted brass and aluminium home décor, carefully sculpted by Moradabad artisans.
        </p>
      </div>

      {/* Categories Grid Container */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) clamp(16px, 5vw, 80px)' }}>
        {loading ? (
          <div style={{
            display: 'grid', gap: 24,
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton" style={{ aspectRatio: '4/5', borderRadius: 16 }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--color-muted)' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
              Unable to load categories. Please try again later.
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--color-muted)' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
              No categories available at the moment.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="category-card"
                aria-label={`Shop ${cat.name}`}
                style={{ textDecoration: 'none', borderRadius: 16 }}
              >
                <img
                  src={cat.cover_image_url || CATEGORY_IMAGES[cat.slug] || `https://placehold.co/400x500/D4A853/FFFCF8?text=${encodeURIComponent(cat.name)}`}
                  alt={cat.name}
                  loading="lazy"
                />
                <div className="category-card-overlay">
                  <p className="category-card-name" style={{ fontSize: '1.25rem' }}>{cat.name}</p>
                  <p className="category-card-cta">
                    Explore Collection <ArrowRight size={14} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
