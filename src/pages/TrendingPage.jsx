import { Flame } from 'lucide-react'
import { useProducts } from '../hooks/useData'
import ProductCard from '../components/ProductCard'

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

export default function TrendingPage() {
  const { products, loading } = useProducts({ trending: true })

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--color-cream)' }}>

      {/* Page header */}
      <section style={{
        background: 'var(--color-charcoal)',
        padding: 'clamp(48px, 6vw, 80px) clamp(16px, 5vw, 80px)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <p style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--color-gold)',
            marginBottom: 16,
          }}>
            <Flame size={13} /> Trending Now
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: 600, color: 'white',
            lineHeight: 1.15, marginBottom: 16,
          }}>
            Our Most Loved Pieces
          </h1>
          <p style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
            color: 'rgba(255,252,248,0.65)',
            maxWidth: 520, lineHeight: 1.7,
          }}>
            Handpicked pieces that our customers keep coming back for — spanning every category in our collection.
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section style={{ padding: 'clamp(40px, 5vw, 64px) clamp(16px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {!loading && products.length > 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 28 }}>
              {products.length} trending {products.length === 1 ? 'piece' : 'pieces'}
            </p>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 24,
          }}>
            {loading
              ? Array(8).fill(null).map((_, i) => <SkeletonCard key={i} />)
              : products.length > 0
                ? products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 24px' }}>
                    <Flame size={40} color="var(--color-border)" style={{ margin: '0 auto 16px', display: 'block' }} />
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-muted)' }}>
                      No trending products at the moment.
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: 8 }}>
                      Check back soon — we update our collection regularly.
                    </p>
                  </div>
                )
            }
          </div>
        </div>
      </section>
    </div>
  )
}
