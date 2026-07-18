import HeroBanner from '../components/home/HeroBanner'
import TrendingStrip from '../components/home/TrendingStrip'
import OurStory from '../components/home/OurStory'
import CategoryGrid from '../components/home/CategoryGrid'
import Reviews from '../components/home/Reviews'
import ContactForm from '../components/home/ContactForm'

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <TrendingStrip />
      <OurStory />
      <CategoryGrid />
      <Reviews />
      <ContactForm />
    </main>
  )
}
