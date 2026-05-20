import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// Simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Quick Commerce Storefront Routes */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Legacy Admin Dashboard Routes */}
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

export default AppRouter;
