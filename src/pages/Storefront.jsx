import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CheckoutModal from '../components/CheckoutModal';
import Toast from '../components/Toast';
import { subscribeProducts, seedInitialProductsIfEmpty } from '../services/productService';
import { ArrowRight } from 'lucide-react';

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    seedInitialProductsIfEmpty();

    const unsubscribe = subscribeProducts((fetchedProducts) => {
      setProducts(fetchedProducts);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const heroWatch = products.find(p => p.name.includes("Chronos Ascent")) || {
    id: 'hero-1',
    name: 'The Chronos Ascent V2',
    price: 9850,
    description: 'Precision engineering meets timeless elegance.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    badge: 'New Arrival'
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F9]">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-10">
        
        {/* HERO BANNER SECTION (Screenshot 1 matching - Compact Layout) */}
        <section id="hero" className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#F5E6E6] shadow-2xs overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            
            {/* Left Content */}
            <div className="space-y-4 max-w-xl">
              <span className="inline-block bg-[#FFF0F0] text-[#C4092F] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#FFD0D0]">
                New Arrival
              </span>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight">
                The Chronos Ascent V2
              </h1>

              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Precision engineering meets timeless elegance. Featuring an in-house automatic movement and a meticulously finished dial, designed for those who appreciate true craftsmanship.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setSelectedProduct(heroWatch)}
                  className="bg-[#C4092F] hover:bg-[#A00725] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-2xs active:scale-95 cursor-pointer"
                >
                  Explore Masterpiece
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href="#curated"
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors text-center"
                >
                  View Specifications
                </a>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="relative flex items-center justify-center bg-[#FAF2F2] rounded-xl p-4 lg:p-6 h-64 sm:h-72">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                alt="The Chronos Ascent V2"
                className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* CURATED COLLECTION SECTION */}
        <section id="curated" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#111111]">
                Curated Collection
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Discover our selection of exceptional timepieces.
              </p>
            </div>
            <a 
              href="#curated" 
              className="text-xs font-semibold text-[#C4092F] hover:underline flex items-center gap-1"
            >
              View All &gt;
            </a>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-[#F0E6E6]">
              <p className="text-gray-500 text-xs">No timepieces found matching "{searchQuery}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuyNow={(prod) => setSelectedProduct(prod)}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={(msg) => setToastMessage(msg)}
        />
      )}

      {/* Toast Popup */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />

      <Footer />
    </div>
  );
}
