import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LiveChat } from './components/LiveChat';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';

import { Home } from './pages/Home';
import { GlobalVideoFooter } from './components/GlobalVideoFooter';

// Lazy load other pages for route-based code splitting
const ProductDetails = React.lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const Cart = React.lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const MyOrders = React.lazy(() => import('./pages/MyOrders').then(m => ({ default: m.MyOrders })));
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = React.lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Support = React.lazy(() => import('./pages/Support').then(m => ({ default: m.Support })));
const SupportCenter = React.lazy(() => import('./pages/SupportCenter').then(m => ({ default: m.SupportCenter })));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminControl = React.lazy(() => import('./pages/AdminControl').then(m => ({ default: m.AdminControl })));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Profile = React.lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));

// Loading UI Fallback
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] w-full bg-slate-50/50 dark:bg-slate-950/50">
    <div className="relative flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#D4A75F] animate-spin" />
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#D4A75F] mt-4 font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  </div>
);


// Luxurious page transition wrapper
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const [appLoading, setAppLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on every route change (but not query param/search updates)
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {appLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950"
          >
            <div className="relative flex flex-col items-center max-w-[280px] w-full text-center">
              {/* Logo / Brand name */}
              <div className="w-20 h-20 mb-6 relative luxury-gold-shimmer rounded-2xl overflow-hidden flex items-center justify-center p-3 shadow-md bg-white border border-slate-100">
                <img src="/logo.svg" alt="SSJewellery" className="w-full h-full object-contain animate-pulse" />
              </div>
              <h2 className="text-[#3F1D5A] dark:text-[#EFE7DB] font-serif text-2xl tracking-widest font-extrabold uppercase animate-pulse">
                SS<span className="text-[#D4A75F] font-light font-sans">Jewellery</span>
              </h2>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#D4A75F] mt-2 font-semibold">
                Crafting Elegance
              </p>
              
              {/* Gold Shimmer Progress Bar */}
              <div className="w-full h-[3px] bg-slate-150 dark:bg-slate-800 rounded-full overflow-hidden mt-8 relative">
                <div className="absolute top-0 bottom-0 left-0 bg-[#D4A75F] w-[50%] animate-shimmer-bar rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Navigation bar */}
        <Navbar />

      {/* Language Preference Selection Modal */}
      <LanguageSelectionModal />

      {/* Main page content area */}
      <main className={`flex-grow ${location.pathname === '/' ? '' : 'pt-24 lg:pt-0'}`}>
        <AnimatePresence mode="wait">
          <React.Suspense fallback={<LoadingFallback />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/product/:id" element={<PageWrapper><ProductDetails /></PageWrapper>} />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <PageWrapper><Cart /></PageWrapper>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <PageWrapper><Checkout /></PageWrapper>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <PageWrapper><MyOrders /></PageWrapper>
                </ProtectedRoute>
              } />
               <Route path="/profile" element={
                <ProtectedRoute userOnly={true}>
                  <PageWrapper><Profile /></PageWrapper>
                </ProtectedRoute>
              } />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
              <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
              <Route path="/support" element={<PageWrapper><Support /></PageWrapper>} />
              <Route path="/support-center" element={
                <ProtectedRoute>
                  <PageWrapper><SupportCenter /></PageWrapper>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <PageWrapper><AdminDashboard /></PageWrapper>
                </ProtectedRoute>
              } />
              <Route path="/admin-control" element={
                <ProtectedRoute adminOnly={true}>
                  <PageWrapper><AdminControl /></PageWrapper>
                </ProtectedRoute>
              } />
            </Routes>
          </React.Suspense>
        </AnimatePresence>
      </main>

      {/* Global Video Footer */}
      <GlobalVideoFooter />

      {/* Interactive chatbot bubble widget */}
      <LiveChat />

      {/* Grid footer links panel - ONLY visible on Profile page */}
      {location.pathname === '/profile' && <Footer />}
    </div>
    </>
  );
}

export default App;

