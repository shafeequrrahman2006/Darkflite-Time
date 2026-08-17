import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, BarChart3, Settings, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/orders', icon: LayoutGrid },
    { label: 'Order Management', path: '/admin/orders', icon: Package },
    { label: 'Product Catalog', path: '/admin/catalog', icon: Package },
    { label: 'Analytics', path: '/admin/orders', icon: BarChart3 },
  ];

  return (
    <aside className="w-56 bg-[#FFF0F0] border-r border-[#F0D5D5] flex flex-col justify-between h-screen sticky top-0 z-30 p-4 flex-shrink-0">
      
      <div>
        {/* Admin Header */}
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#F0D0D0]">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
              alt="Admin Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-[#FF9C9A]"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="font-heading text-xs font-bold text-[#C4092F] leading-tight">
              Admin Portal
            </h2>
            <p className="text-[10px] text-gray-500 font-medium">
              Management Suite
            </p>
          </div>
        </div>

        {/* Quick Action Button: Add New Product */}
        <button
          onClick={() => navigate('/admin/add-product')}
          className="w-full bg-[#C4092F] hover:bg-[#A00725] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 mb-4 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Product
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive && item.label === 'Order Management'
                      ? 'bg-[#C4092F] text-white shadow-2xs font-semibold'
                      : 'text-gray-700 hover:bg-[#FFE5E5] hover:text-[#C4092F]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="pt-3 border-t border-[#F0D0D0] space-y-0.5">
        <button
          onClick={() => navigate('/admin/orders')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-[#FFE5E5] hover:text-[#C4092F] transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-[#FFE5E5] hover:text-[#C4092F] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
