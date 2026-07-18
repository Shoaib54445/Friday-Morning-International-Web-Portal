import { Link } from 'react-router-dom'
import { Flame, ArrowRight } from 'lucide-react'
import { useCategories, useProducts } from '../../hooks/useData'
import ProductCard from '../ProductCard'

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '4/5', borderRadius: '12px 12px 0 0' }} />
      <div style={{ padding: 16, background: 'var(--color-warm-white)', borderRadius: '0 0 12px 12px' }}>
        <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '30%' }} />
      </div>
    </div>
  )
}

export default function TrendingStrip() {
  const { categories } = useCategories({ featuredOnly: true })
  const { products, loading } = useProducts({ trending: true, limit: 8 })

  return (
    <section id="trending" style={{ background: 'var(--color-cream)', padding: 'clamp(48px, 6vw, 80px) clamp(16px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Featured category pills */}
        {categories.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>Shop by Category</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 20px',
                    background: 'var(--color-warm-white)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 999,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.82rem', fontWeight: 500,
                    color: 'var(--color-charcoal-mid)',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 2px 8px rgba(44,36,23,0.05)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--color-copper)'
                    e.currentTarget.style.borderColor = 'var(--color-copper)'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(184,115,51,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--color-warm-white)'
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'var(--color-charcoal-mid)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(44,36,23,0.05)'
                  }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Trending section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flame size={12} /> Trending Now
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--color-bronze)', margin: 0 }}>
              Our Most Loved Pieces
            </h2>
          </div>
          <Link
            to="/trending"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-copper)',
              textDecoration: 'none', transition: 'gap 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.gap = '10px'}
            onMouseLeave={e => e.currentTarget.style.gap = '6px'}
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {/* Products grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {loading
            ? Array(4).fill(null).map((_, i) => <SkeletonCard key={i} />)
            : products.length > 0
              ? products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 64 }}>
                  <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
                    Our trending collection is being curated. Check back soon.
                  </p>
                </div>
              )
          }
        </div>
      </div>
    </section>
  )
}
