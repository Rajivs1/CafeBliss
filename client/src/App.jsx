import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import SplashScreen from './components/common/SplashScreen';

// Pages
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import Cart from './pages/customer/Cart';
import OrderTracking from './pages/customer/OrderTracking';
import Reservation from './pages/customer/Reservation';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMenu from './pages/admin/ManageMenu';
import ManageStaff from './pages/admin/ManageStaff';
import ManageReservations from './pages/admin/ManageReservations';
import Analytics from './pages/admin/Analytics';

import './App.css';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="app">
      {!isHomePage && <Navbar />}
      <main className={isHomePage ? '' : 'main-content'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Reservation />
              </ProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageReservations />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem('hasVisitedCafe');
    if (visited) {
      // Use a microtask to avoid synchronous setState inside effect
      Promise.resolve().then(() => {
        setShowSplash(false);
        setHasVisited(true);
        setAppReady(true);
      });
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasVisited(true);
    // Mark as visited in session storage
    sessionStorage.setItem('hasVisitedCafe', 'true');
    // Small delay before showing app content
    setTimeout(() => {
      setAppReady(true);
    }, 100);
  };

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {showSplash && !hasVisited && (
            <SplashScreen onComplete={handleSplashComplete} />
          )}
          {appReady && <AppContent />}
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
