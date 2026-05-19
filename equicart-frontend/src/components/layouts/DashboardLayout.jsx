import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, Search } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 glass border-b-0 border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-textSecondary hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-2 bg-surface border border-white/10 rounded-full px-4 py-2">
              <Search size={18} className="text-textSecondary" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-sm text-white placeholder-textSecondary w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-textSecondary hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white leading-none mb-1">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-textSecondary leading-none">{user?.role || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
