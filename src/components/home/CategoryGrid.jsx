import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCategories } from '../../hooks/useData'

// Local fallback images for categories using actual product photos
const CATEGORY_IMAGES = {
  'candle-holders':    '/items/FM130A.png',
  'cake-stands-trays': '/items/FMI 393A.jpg',
  'urlis-bowls':       '/items/Fm968.png',
  'decor-figurines':   '/items/FMI 612A.png',
  'serving-sets':      '/items/Fm960.png',
}

export default function CategoryGrid() {
  const { categories: featuredCategories, loading: loadingFeatured } = useCategories({ featuredOnly: true })
  const { categories: allCategories, loading: loadingAll } = useCategories()

  const loading = loadingFeatured && loadingAll
  // Use featured categories if available, otherwise fallback to top categories
  const categoriesToDisplay = featuredCategories.length > 0
    ? featuredCategories
    : allCategories.slice(0, 4)

  if (loading) {
    return (
      <section style={{ padding: 'clamp(48px, 8vw, 96px) clamp(16px, 5vw, 80px)', background: 'var(--color-warm-white)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ height: 24, width: 120 }} className="skeleton" />
          <div style={{ height: 40, width: 300, marginTop: 8 }} className="skeleton" />
          <div style={{
            display: 'grid', gap: 20, marginTop: 40,
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ aspectRatio: '4/5', borderRadius: 12 }} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="categories"
      style={{ padding: 'clamp(48px, 8vw, 96px) clamp(16px, 5vw, 80px)', background: 'var(--color-warm-white)' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Browse Our World</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            color: 'var(--color-bronze)',
          }}>
            Shop by Category
          </h2>
          <p style={{ color: 'var(--color-muted)', marginTop: 12, maxWidth: 520, margin: '12px auto 0', fontSize: '0.95rem' }}>
            Each collection is a chapter in our craft story — from illuminating candle holders to contemplative urlis and bold sculptural accents.
          </p>
        </div>

        {/* Featured Categories Grid */}
        {categoriesToDisplay.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: 'var(--color-muted)' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
              Our collections are being prepared. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
            }}>
              {categoriesToDisplay.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="category-card"
                  aria-label={`Shop ${cat.name}`}
                  style={{ textDecoration: 'none' }}
                >
                  <img
                    src={cat.cover_image_url || CATEGORY_IMAGES[cat.slug] || `https://placehold.co/400x500/D4A853/FFFCF8?text=${encodeURIComponent(cat.name)}`}
                    alt={cat.name}
                    loading="lazy"
                  />
                  <div className="category-card-overlay">
                    <p className="category-card-name">{cat.name}</p>
                    <p className="category-card-cta">
                      Explore <ArrowRight size={12} />
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Categories Button */}
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link
                to="/categories"
                className="btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 28px',
                  fontSize: '0.9rem',
                }}
              >
                Show All Categories <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
