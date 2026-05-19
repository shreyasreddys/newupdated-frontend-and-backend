import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import StoreLayout from '../components/layouts/StoreLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';

// Pages
import HomePage from '../pages/HomePage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Admin Pages
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import ProductManagement from '../pages/products/ProductManagement';
import OrderManagement from '../pages/orders/OrderManagement';
import PaymentDashboard from '../pages/payments/PaymentDashboard';
import ProfilePage from '../pages/profile/ProfilePage';

// Protected route wrapper - forces login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRouterV2 = () => {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* STRICTLY PROTECTED Quick Commerce Storefront Routes */}
        <Route path="/" element={<ProtectedRoute><StoreLayout /></ProtectedRoute>}>
          <Route index element={<HomePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        {/* Protected Admin Dashboard Routes */}
        <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="payments" element={<PaymentDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouterV2;
