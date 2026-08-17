import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { subscribeProducts, deleteProduct } from '../services/productService';
import { Plus, Trash2, ExternalLink, ArrowLeft } from 'lucide-react';

export default function AdminCatalog() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeProducts((fetched) => {
      setProducts(fetched);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from catalog?`)) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#C4092F] mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <h1 className="font-heading text-3xl font-bold text-[#111111]">
              Product Catalog
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage luxury timepieces published in your online store.
            </p>
          </div>


          <button
            onClick={() => navigate('/admin/add-product')}
            className="bg-[#C4092F] hover:bg-[#A00725] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const formattedPrice = new Intl.NumberFormat('en-IN', {
              maximumFractionDigits: 0
            }).format(product.price);

            return (
              <div key={product.id} className="bg-white rounded-2xl p-5 border border-[#F0E6E6] shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="bg-[#FFF5F5] h-48 rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#FFEAEA] text-[#C4092F] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#FFCCCC]">
                        {product.badge}
                      </span>
                    )}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div>
                    <h3 className="font-heading text-base font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-heading text-base font-bold text-[#111111]">
                    ₹{formattedPrice}
                  </span>

                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-2 text-gray-400 hover:text-[#C4092F] hover:bg-[#FFF0F0] rounded-lg transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
