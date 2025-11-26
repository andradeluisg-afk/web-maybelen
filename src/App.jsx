import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Store from './pages/Store/Home';
import ProductDetail from './pages/Store/ProductDetail';
import AdminLogin from './pages/Admin/AdminLogin';
import Inventory from './pages/Admin/Inventory';
import CategoriesManager from './pages/Admin/CategoriesManager';

function App() {
  return (
    <StoreProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Landing /></>} />
            <Route path="/tienda" element={<><Navbar /><CartDrawer /><Store /></>} />
            <Route path="/product/:id" element={<><Navbar /><CartDrawer /><ProductDetail /></>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <><Navbar /><Inventory /></>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <><Navbar /><CategoriesManager /></>
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;
