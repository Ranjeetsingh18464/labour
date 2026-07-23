import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { Spinner } from './components/ui';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const FAQ = lazy(() => import('./pages/public/FAQ'));
const SearchResults = lazy(() => import('./pages/public/SearchResults'));
const LabourProfile = lazy(() => import('./pages/public/LabourProfile'));
const LabourRegistration = lazy(() => import('./pages/public/LabourRegistration'));
const Categories = lazy(() => import('./pages/public/Categories'));
const CategoryDetail = lazy(() => import('./pages/public/CategoryDetail'));
const BookingPage = lazy(() => import('./pages/public/BookingPage'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageLabours = lazy(() => import('./pages/admin/ManageLabours'));
const ManageCategories = lazy(() => import('./pages/admin/ManageCategories'));
const ManageCities = lazy(() => import('./pages/admin/ManageCities'));
const ManageBanners = lazy(() => import('./pages/admin/ManageBanners'));
const ManageBookings = lazy(() => import('./pages/admin/ManageBookings'));
const ManageReviews = lazy(() => import('./pages/admin/ManageReviews'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const Settings = lazy(() => import('./pages/admin/Settings'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
  </div>
);

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const PageWrapper = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

const PublicRoute = ({ element }) => (
  <PublicLayout>
    <Suspense fallback={<PageLoader />}>
      <PageWrapper>{element}</PageWrapper>
    </Suspense>
  </PublicLayout>
);

const AdminRoute = ({ element }) => (
  <ProtectedRoute requiredRole="admin">
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        <PageWrapper>{element}</PageWrapper>
      </Suspense>
    </AdminLayout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute element={<Login />} />} />
      <Route path="/register" element={<PublicRoute element={<Register />} />} />
      <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />

      <Route path="/" element={<PublicRoute element={<Home />} />} />
      <Route path="/about" element={<PublicRoute element={<About />} />} />
      <Route path="/contact" element={<PublicRoute element={<Contact />} />} />
      <Route path="/faq" element={<PublicRoute element={<FAQ />} />} />
      <Route path="/search" element={<PublicRoute element={<SearchResults />} />} />
      <Route path="/labour/:id" element={<PublicRoute element={<LabourProfile />} />} />
      <Route path="/labour/register" element={<PublicRoute element={<LabourRegistration />} />} />
      <Route path="/categories" element={<PublicRoute element={<Categories />} />} />
      <Route path="/category/:slug" element={<PublicRoute element={<CategoryDetail />} />} />
      <Route path="/booking/:labourId" element={<PublicRoute element={<BookingPage />} />} />

      <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
      <Route path="/admin/labours" element={<AdminRoute element={<ManageLabours />} />} />
      <Route path="/admin/categories" element={<AdminRoute element={<ManageCategories />} />} />
      <Route path="/admin/cities" element={<AdminRoute element={<ManageCities />} />} />
      <Route path="/admin/banners" element={<AdminRoute element={<ManageBanners />} />} />
      <Route path="/admin/bookings" element={<AdminRoute element={<ManageBookings />} />} />
      <Route path="/admin/reviews" element={<AdminRoute element={<ManageReviews />} />} />
      <Route path="/admin/reports" element={<AdminRoute element={<Reports />} />} />
      <Route path="/admin/settings" element={<AdminRoute element={<Settings />} />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
