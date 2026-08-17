import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#FFF0F0] border-t border-[#F0D5D5] py-6 px-4 sm:px-6 lg:px-8 mt-20 text-xs text-gray-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="font-heading font-bold text-sm text-[#111111] tracking-wider">
          DARKFLITE TIME
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-700">
          <a href="#" className="hover:text-[#C4092F] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#C4092F] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#C4092F] transition-colors">Shipping & Returns</a>
          <a href="#" className="hover:text-[#C4092F] transition-colors">Contact Us</a>
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-[11px]">
          © 2026 DARKFLITE TIME. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
