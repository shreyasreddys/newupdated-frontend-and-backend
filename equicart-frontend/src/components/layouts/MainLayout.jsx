import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Package, ShoppingCart } from 'lucide-react';
import Button from '../ui/Button';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass border-b-0 border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white tracking-tight">
            <Package className="text-primary" size={32} />
            <span>Equi<span className="text-primary">Cart</span></span>
          </Link>
          
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-sm font-medium text-textSecondary hover:text-white transition-colors">Home</Link>
            <Link to="#features" className="text-sm font-medium text-textSecondary hover:text-white transition-colors">Features</Link>
            <Link to="#pricing" className="text-sm font-medium text-textSecondary hover:text-white transition-colors">Pricing</Link>
          </nav>

          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <Package className="text-primary" size={24} />
              <span>Equi<span className="text-primary">Cart</span></span>
            </Link>
            <p className="text-textSecondary text-sm">Enterprise cloud-native retail solution powered by AWS.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li><Link to="#" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li><Link to="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-sm text-textSecondary">
          © {new Date().getFullYear()} EquiCart. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
