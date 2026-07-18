import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { useBanners } from '../../hooks/useData'
import { ArrowRight } from 'lucide-react'

// Static banners as fallback (using local images in /public)
const STATIC_BANNERS = [
  {
    id: 's1', cloudinary_url: '/banner1.jpg',
    headline: 'The Art of the Everyday',
    subheadline: 'Handcrafted brass & aluminium décor — born from Moradabad\'s centuries-old artisan heritage.',
    cta_text: 'Explore Collection', cta_link: '/category/candle-holders'
  },
  {
    id: 's2', cloudinary_url: '/banner2.jpg',
    headline: 'Elevated Entertaining',
    subheadline: 'Cake stands and serving trays that transform every table into a tableau.',
    cta_text: 'Shop Cake Stands', cta_link: '/category/cake-stands-trays'
  },
  {
    id: 's3', cloudinary_url: '/banner3.jpg',
    headline: 'Born of the Brass City',
    subheadline: 'Centuries of tradition. Crafted for the modern home.',
    cta_text: 'Our Story', cta_link: '/#story'
  },
  {
    id: 's4', cloudinary_url: '/banner4.jpg',
    headline: 'Sculpted in Gold',
    subheadline: 'Urlis, figurines and bowls — each piece a conversation.',
    cta_text: 'Shop Urlis & Bowls', cta_link: '/category/urlis-bowls'
  },
]

export default function HeroBanner() {
  const { banners: dbBanners, loading } = useBanners()
  const navigate = useNavigate()
  const swiperRef = useRef(null)

  const banners = dbBanners.length > 0 ? dbBanners : STATIC_BANNERS

  const handleCTA = (e, link) => {
    e.preventDefault()
    if (link.startsWith('/') && !link.includes('#')) {
      navigate(link)
    } else if (link.includes('#')) {
      const [path, hash] = link.split('#')
      if (path === '' || path === '/') {
        const el = document.getElementById(hash)
        el ? el.scrollIntoView({ behavior: 'smooth' })
            : (navigate('/'), setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 400))
      } else {
        navigate(link)
      }
    } else {
      navigate(link)
    }
  }

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100vh', background: 'var(--color-cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '100%', height: '100%' }} />
      </div>
    )
  }

  return (
    <section
      style={{ position: 'relative', width: '100%', height: '100vh', minHeight: 500 }}
      onMouseEnter={() => swiperRef.current?.swiper?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.swiper?.autoplay?.start()}
    >
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        style={{ width: '100%', height: '100%' }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} style={{ position: 'relative', background: 'var(--color-charcoal)' }}>
            {/* Background image — object-fit:contain so full image is visible */}
            <img
              src={banner.cloudinary_url}
              alt={banner.headline || 'Friday Morning International'}
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain', objectPosition: 'center',
              }}
            />
            {/* Dark overlay gradient */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(44,36,23,0.6) 0%, rgba(44,36,23,0.2) 60%, transparent 100%)',
            }} />
            {/* Text overlay */}
            {(banner.headline || banner.cta_text) && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center',
                padding: 'clamp(24px, 6vw, 100px)',
                paddingBottom: 'clamp(60px, 8vw, 100px)',
              }}>
                <div style={{ maxWidth: 560, color: 'white' }}>
                  {banner.subheadline && (
                    <p style={{
                      fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: 'var(--color-gold-light)',
                      marginBottom: 12, opacity: 0.9
                    }}>
                      {banner.subheadline.length > 40 ? 'Friday Morning International' : banner.subheadline}
                    </p>
                  )}
                  {banner.headline && (
                    <h1 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                      fontWeight: 600, lineHeight: 1.1,
                      color: 'white',
                      marginBottom: 16,
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                    }}>
                      {banner.headline}
                    </h1>
                  )}
                  {banner.subheadline && banner.subheadline.length > 40 && (
                    <p style={{
                      fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                      color: 'rgba(255,252,248,0.85)',
                      lineHeight: 1.6, marginBottom: 32, maxWidth: 440
                    }}>
                      {banner.subheadline}
                    </p>
                  )}
                  {banner.cta_text && (
                    <a
                      href={banner.cta_link || '#'}
                      onClick={(e) => handleCTA(e, banner.cta_link || '#')}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '14px 32px',
                        marginTop: 24,
                        background: 'var(--color-copper)',
                        color: 'white',
                        borderRadius: 6,
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 500, fontSize: '0.9rem', letterSpacing: '0.05em',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(184,115,51,0.4)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--color-copper-dark)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--color-copper)'
                        e.currentTarget.style.transform = 'none'
                      }}
                    >
                      {banner.cta_text}
                      <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
