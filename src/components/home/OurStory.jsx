import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function OurStory() {
  return (
    <section
      id="story"
      style={{
        background: 'var(--color-charcoal)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(212,168,83,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: 'clamp(48px, 8vw, 100px) clamp(16px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 64,
        alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>

        {/* Text side */}
        <div>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--color-gold)',
            marginBottom: 16
          }}>
            Our Story
          </p>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
            color: 'white', fontWeight: 600, lineHeight: 1.15,
            marginBottom: 28,
          }}>
            From Peetal Nagri,<br />to Your Home
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,252,248,0.75)', lineHeight: 1.8 }}>
              Nestled along the banks of the Ramganga river in western Uttar Pradesh, Moradabad has carried the title of <em style={{ color: 'var(--color-gold-light)' }}>Peetal Nagri</em> — the Brass City — for over four centuries. Its bazaars have supplied the world with handcrafted metalwork since the Mughal era, when the region's gifted karigars first refined the art of lost-wax casting and hand-chasing brass into objects of rare beauty.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,252,248,0.75)', lineHeight: 1.8 }}>
              Friday Morning International was founded on a simple belief: that these extraordinary crafts deserve a home in every household that values beauty and heritage. We work directly with multi-generational artisan families — the same hands that have shaped brass and aluminium for decades — to bring their finest work to discerning homes across India and beyond.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,252,248,0.75)', lineHeight: 1.8 }}>
              Every piece in our collection is individually cast, hand-finished, and quality-checked before it reaches you. No two are perfectly identical — which is exactly the point. In a world of mass production, we believe imperfection is the mark of something genuinely made.
            </p>
          </div>

          <div style={{ marginTop: 36, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a
              href="#contact"
              onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="btn-primary"
            >
              Get in Touch <ArrowRight size={15} />
            </a>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: 24, marginTop: 48,
            paddingTop: 40,
            borderTop: '1px solid rgba(255,252,248,0.1)',
          }}>
            {[
              { value: '400+', label: 'Years of Craft' },
              { value: '100%', label: 'Handmade' },
              { value: '1000+', label: 'Artisan Families' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: 'var(--color-gold)',
                  fontWeight: 600, marginBottom: 4
                }}>
                  {value}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,252,248,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image collage side */}
        <div className="story-image-collage" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 32 }}>
            <div style={{
              borderRadius: 12, overflow: 'hidden', aspectRatio: '3/4',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            }}>
              <img
                src="/items/Fm968.png"
                alt="Peony Urli — handcrafted in Moradabad"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              borderRadius: 12, overflow: 'hidden', aspectRatio: '1/1',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            }}>
              <img
                src="/items/Fm983.png"
                alt="Branch & Bloom Bowl — artisan crafted brass"
                style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#FAF7F2' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              borderRadius: 12, overflow: 'hidden', aspectRatio: '1/1',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            }}>
              <img
                src="/items/FMI 393A.jpg"
                alt="Three-Tier Lotus Cake Stand"
                style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#FAF7F2' }}
              />
            </div>
            <div style={{
              borderRadius: 12, overflow: 'hidden', aspectRatio: '3/4',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            }}>
              <img
                src="/items/FM130A.png"
                alt="Stag Head Candle Holder — hand-finished aluminium"
                style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#FAF7F2' }}
              />
            </div>
          </div>

          {/* Decorative gold accent */}
          <div style={{
            position: 'absolute', top: -16, right: -16,
            width: 80, height: 80,
            border: '2px solid var(--color-gold)',
            borderRadius: 12, opacity: 0.3,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -12, left: -12,
            width: 60, height: 60,
            border: '2px solid var(--color-copper)',
            borderRadius: 8, opacity: 0.3,
            pointerEvents: 'none',
          }} />
        </div>
      </div>
    </section>
  )
}
