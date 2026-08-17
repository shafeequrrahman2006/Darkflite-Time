import React from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ searchQuery, setSearchQuery, cartCount = 0 }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-[#F0E6E6] sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-heading text-xl font-bold tracking-tight text-[#C4092F] group-hover:text-[#A00725] transition-colors">
            Darkflite Time
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium">
          <Link 
            to="/" 
            className="text-[#C4092F] font-semibold relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C4092F]"
          >
            Collections
          </Link>
          <a href="#hero" className="text-gray-700 hover:text-[#C4092F] transition-colors py-1">
            New Arrivals
          </a>
          <a href="#curated" className="text-gray-700 hover:text-[#C4092F] transition-colors py-1">
            Heritage
          </a>
          <a href="#curated" className="text-gray-700 hover:text-[#C4092F] transition-colors py-1">
            Pre-Owned
          </a>
        </nav>

        {/* Right Actions: Search & Admin Link / Cart */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-40 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF5F5] border border-[#EFE0E0] rounded-lg pl-8 pr-2.5 py-1 text-xs focus:outline-none focus:border-[#C4092F] focus:bg-white transition-all text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Cart Icon */}
          <button 
            className="p-1.5 text-gray-700 hover:text-[#C4092F] hover:bg-[#FFF0F0] rounded-full transition-colors relative"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C4092F] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin User Button */}
          <button
            onClick={() => navigate(isAuthenticated ? '/admin/orders' : '/admin/login')}
            className="flex items-center gap-1 p-1.5 text-gray-700 hover:text-[#C4092F] hover:bg-[#FFF0F0] rounded-full transition-colors"
            title={isAuthenticated ? "Admin Suite" : "Admin Login"}
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
