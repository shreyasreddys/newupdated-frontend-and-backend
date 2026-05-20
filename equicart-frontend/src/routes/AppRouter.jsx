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

// Simple protected route wrapper using Redux state
const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
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
          <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Standardized Administrative Console Routes */}
        <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="payments" element={<PaymentDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
