import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '../hooks/useData'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const PAGE_SIZE = 12

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest')
  const { products: allProducts, loading, error } = useProducts({ categorySlug: slug })

  // Fetch category metadata
  useEffect(() => {
    supabase.from('categories').select('*').eq('slug', slug).single()
      .then(({ data }) => setCategory(data))
  }, [slug])

  // Client-side sort
  const sorted = [...allProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.discount_price || a.price) - (b.discount_price || b.price)
    if (sortBy === 'price-desc') return (b.discount_price || b.price) - (a.discount_price || a.price)
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return new Date(b.created_at) - new Date(a.created_at) // newest
  })

  const paginated = sorted.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < sorted.length

  if (error) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px 64px' }}>
        <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
          Unable to load this collection. Please try again.
        </p>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* Category hero */}
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
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'rgba(255,252,248,0.5)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={12} color="rgba(255,252,248,0.4)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>
            {category?.name || slug}
          </span>
        </nav>
        <h1 style={{
          fontFamily: 'var(--font-serif)', color: 'white',
          fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 600, marginBottom: 12, position: 'relative', zIndex: 1
        }}>
          {category?.name || 'Collection'}
        </h1>
        <p style={{ color: 'rgba(255,252,248,0.6)', fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>
          {allProducts.length > 0 ? `${allProducts.length} handcrafted piece${allProducts.length !== 1 ? 's' : ''}` : 'Curated handcrafted pieces'}
        </p>
      </div>

      {/* Controls bar */}
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: '20px clamp(16px, 5vw, 80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        borderBottom: '1px solid var(--color-border)',
      }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
          {loading ? 'Loading…' : `Showing ${paginated.length} of ${sorted.length} items`}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={14} color="var(--color-muted)" />
          <label htmlFor="sort-select" style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setPage(1) }}
            style={{
              padding: '6px 12px', borderRadius: 6, border: '1px solid var(--color-border)',
              background: 'white', fontSize: '0.85rem', color: 'var(--color-charcoal)',
              cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Products grid */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px clamp(16px, 5vw, 80px) 64px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {Array(8).fill(null).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '4/5', borderRadius: '12px 12px 0 0' }} />
                <div style={{ padding: 16, background: 'var(--color-warm-white)', borderRadius: '0 0 12px 12px' }}>
                  <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: '30%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-bronze)', marginBottom: 12 }}>
              No items in this collection yet.
            </p>
            <p style={{ color: 'var(--color-muted)', marginBottom: 28 }}>
              Our artisans are crafting something beautiful. Check back soon.
            </p>
            <Link to="/" className="btn-outline">← Back to Home</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {paginated.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <button className="btn-outline" onClick={() => setPage(p => p + 1)}>
                  Load More Pieces
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
