import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Public pages
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import CategoriesPage from './pages/CategoriesPage'
import ProductPage from './pages/ProductPage'
import TrendingPage from './pages/TrendingPage'

// Admin
import AdminLogin from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'
import AdminCategories from './pages/admin/Categories'
import AdminProducts from './pages/admin/Products'
import AdminReviews from './pages/admin/Reviews'
import ContactSubmissions from './pages/admin/Contact'
import AdminBanners from './pages/admin/Banners'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            borderRadius: '8px',
            background: '#FFFCF8',
            color: '#2C2417',
            border: '1px solid #E8DFD4',
            boxShadow: '0 8px 24px rgba(44,36,23,0.12)',
          },
          success: { iconTheme: { primary: '#B87333', secondary: '#FFFCF8' } },
          error: { iconTheme: { primary: '#721c24', secondary: '#FFFCF8' } },
          duration: 4000,
        }}
      />

      <Routes>
        {/* ── Public Routes ─────────────────────── */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/categories" element={<PublicLayout><CategoriesPage /></PublicLayout>} />
        <Route path="/category/:slug" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/product/:slug" element={<PublicLayout><ProductPage /></PublicLayout>} />
        <Route path="/trending" element={<PublicLayout><TrendingPage /></PublicLayout>} />

        {/* ── Admin Routes (Hidden Obfuscated Route) ── */}
        <Route path="/1972/admin/login" element={<AdminLogin />} />
        <Route
          path="/1972/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/1972/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="contact" element={<ContactSubmissions />} />
          <Route path="banners" element={<AdminBanners />} />
        </Route>

        {/* ── 404 ───────────────────────────────── */}
        <Route path="*" element={
          <PublicLayout>
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: '80px 24px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-bronze)' }}>Page Not Found</h1>
              <p style={{ color: 'var(--color-muted)' }}>The page you're looking for doesn't exist or has been moved.</p>
              <a href="/" className="btn-primary">← Return Home</a>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </BrowserRouter>
  )
}
