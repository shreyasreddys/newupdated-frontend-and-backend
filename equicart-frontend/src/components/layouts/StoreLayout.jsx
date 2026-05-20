import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, User, LogOut, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { CartContext } from '../../context/CartContext';
import CartSidebar from './CartSidebar';

const StoreLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsCartOpen, cartCount } = useContext(CartContext);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-danger/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo & Location */}
            <div className="flex items-center gap-6 flex-1 md:flex-none">
              <Link to="/" className="text-2xl font-bold text-white tracking-tight hidden md:block">
                Equi<span className="text-primary">Cart</span>
              </Link>
              
              <div className="flex flex-col flex-1 md:w-64 cursor-pointer group">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  Delivery in 10 mins
                </span>
                <span className="text-sm text-textSecondary flex items-center gap-1 truncate group-hover:text-white transition-colors">
                  <MapPin size={14} className="text-primary shrink-0" />
                  BTM Layout, Bangalore, India...
                </span>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
              <input 
                type="text" 
                placeholder="Search for groceries, electronics, and more..." 
                className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
              <Link to={user ? "/admin" : "/login"} className="flex items-center gap-2 text-textSecondary hover:text-white transition-colors">
                <User size={20} />
                <span className="hidden sm:block text-sm font-medium">{user ? (user.username || 'Account') : 'Login'}</span>
              </Link>

              {user && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-textSecondary hover:text-danger transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:block text-sm font-medium">Logout</span>
                </button>
              )}

              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 relative"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:block">My Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-background text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Search Bar - Mobile */}
          <div className="mt-3 md:hidden relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Cart Sidebar component injected globally */}
      <CartSidebar />
    </div>
  );
};

export default StoreLayout;
