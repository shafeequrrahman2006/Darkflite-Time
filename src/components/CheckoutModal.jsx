import React, { useState } from 'react';
import { X, ArrowRight, Truck } from 'lucide-react';
import { createOrder } from '../services/orderService';

export default function CheckoutModal({ product, onClose, onSuccess }) {
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(product.price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !mobileNumber.trim() || !shippingAddress.trim()) {
      setError('Please complete all delivery details before confirming.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createOrder({
        customerName: customerName.trim(),
        mobileNumber: mobileNumber.trim(),
        shippingAddress: shippingAddress.trim(),
        item: {
          productName: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        }
      });

      setIsSubmitting(false);
      onSuccess(`Order placed successfully for ${product.name}!`);
      onClose();
    } catch (err) {
      console.error("Order submission error:", err);
      setError("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-[#F0E6E6] relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-heading text-lg font-bold text-[#111111]">
            Secure Checkout
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Selected Product Banner */}
          <div className="bg-[#FFF5F5] rounded-xl p-4 flex items-center gap-4 border border-[#FFE0E0]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 object-contain mix-blend-multiply bg-white rounded-lg p-1 border border-gray-100"
            />
            <div className="flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C4092F] block">
                {product.badge || "Heritage Collection"}
              </span>
              <h4 className="font-heading text-sm font-bold text-[#111111] line-clamp-1">
                {product.name}
              </h4>
              <span className="font-heading text-base font-bold text-[#111111] block mt-0.5">
                ₹{formattedPrice}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-[#111111] mb-3">
              Delivery Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4092F] focus:ring-1 focus:ring-[#C4092F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4092F] focus:ring-1 focus:ring-[#C4092F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="123 Luxury Ave, Suite 400..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4092F] focus:ring-1 focus:ring-[#C4092F] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method - Locked to COD */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-[#111111] mb-2">
              Payment Method
            </h3>
            <div className="bg-[#FFF5F5] border border-[#FFD0D0] rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-4 border-[#C4092F] bg-white flex-shrink-0" />
                <Truck className="w-4 h-4 text-[#C4092F]" />
                <span className="text-xs font-medium text-gray-800">
                  Cash on Delivery (COD)
                </span>
              </div>
              <span className="bg-[#FFE5E5] text-[#C4092F] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#FFC0C0]">
                Locked
              </span>
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#C4092F] font-medium text-center">
              {error}
            </p>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C4092F] hover:bg-[#A00725] text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? "Processing..." : "Confirm Order"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
