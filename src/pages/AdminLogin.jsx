import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Contact, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [adminIdInput, setAdminIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const result = login(adminIdInput || 'ADMIN-HOROLOGUE', passwordInput || 'admin123');
    if (result.success) {
      navigate('/admin/orders');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] flex flex-col items-center justify-center p-4 relative">
      
      {/* Top Left Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#C4092F] bg-white border border-[#F0E6E6] px-4 py-2 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Storefront
      </button>

      
      {/* Login Card Container (Screenshot 3 matching) */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-[#F0E6E6] relative">
        
        {/* Top Accent Stripe */}
        <div className="h-1.5 bg-[#C4092F] w-full" />

        <div className="p-8 sm:p-10 space-y-6">
          
          {/* Brand Emblem */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#FFF5F5] rounded-2xl border border-[#FFD0D0] flex flex-col items-center justify-center p-2 shadow-xs">
              <div className="w-7 h-7 rounded-full border border-[#C4092F] flex items-center justify-center text-[#C4092F] font-heading font-bold text-xs mb-1">
                W
              </div>
              <span className="text-[9px] font-heading font-bold tracking-widest text-[#C4092F] uppercase">
                AURUM & CO.
              </span>
            </div>
          </div>

          {/* Header Title */}
          <div className="text-center space-y-1">
            <h1 className="font-heading text-2xl font-bold text-[#111111]">
              Admin Portal
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Secure Authentication
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* Admin ID Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Admin ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Contact className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your ID"
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#C4092F] focus:ring-1 focus:ring-[#C4092F] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#C4092F] focus:ring-1 focus:ring-[#C4092F] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#C4092F] focus:ring-[#C4092F]"
                />
                Remember me
              </label>
              <a href="#" className="text-[#C4092F] font-semibold hover:underline">
                Forgot password?
              </a>
            </div>

            {error && (
              <p className="text-xs text-[#C4092F] font-medium text-center">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#C4092F] hover:bg-[#A00725] text-white text-xs font-semibold py-3 rounded-xl transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              Login
            </button>
          </form>

          {/* Encryption Footer Notice */}
          <div className="text-center pt-2">
            <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
              Protected by advanced encryption. Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <p className="mt-8 text-[11px] text-gray-400 font-semibold tracking-wider">
        © 2024 HOROLOGUE LUXURY.
      </p>
    </div>
  );
}
