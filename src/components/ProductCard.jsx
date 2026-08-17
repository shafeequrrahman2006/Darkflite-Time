import React from 'react';

export default function ProductCard({ product, onBuyNow }) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 border border-[#F0E6E6] flex flex-col group">
      
      {/* Watch Image Box */}
      <div className="relative bg-[#FFF5F5] h-44 p-4 flex items-center justify-center overflow-hidden">
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-[#FFEAEA] text-[#C4092F] text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider z-10 border border-[#FFCCCC]">
            {product.badge}
          </span>
        )}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Card Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="font-heading text-sm font-bold text-[#111111] line-clamp-1 mb-1 group-hover:text-[#C4092F] transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="font-heading text-base font-bold text-[#111111]">
            ₹{formattedPrice}
          </span>
          <button
            onClick={() => onBuyNow(product)}
            className="bg-[#C4092F] hover:bg-[#A00725] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-2xs"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
