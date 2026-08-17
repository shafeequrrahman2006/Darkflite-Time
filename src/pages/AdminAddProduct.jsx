import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { addProduct } from '../services/productService';
import { Info, Image as ImageIcon, UploadCloud, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AdminAddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [badge, setBadge] = useState('Heritage Collection');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !description.trim()) {
      setStatusMsg("Please fill in Watch Name, Price, and Description.");
      return;
    }

    setIsSubmitting(true);
    setStatusMsg("");

    try {
      await addProduct(
        {
          name: name.trim(),
          price: Number(price),
          description: description.trim(),
          imageUrl: imageUrl.trim() || imagePreview || "https://images.unsplash.com/photo-1547996160-012745cc5836?q=80&w=1000&auto=format&fit=crop",
          badge: badge
        },
        imageFile
      );

      setIsSubmitting(false);
      setSuccessToast(true);
      
      // Redirect to catalog or home after short delay
      setTimeout(() => {
        navigate('/admin/catalog');
      }, 1000);
    } catch (err) {
      console.error("Failed to publish product:", err);
      setStatusMsg("Error saving product to Firestore.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Container */}
      <main className="flex-1 p-6 overflow-y-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#C4092F] mb-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <h1 className="font-heading text-2xl font-bold text-[#111111]">
              Add New Product
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload inventory to the DARKFLITE TIME catalog.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handlePublish} className="space-y-6">
          
          {/* Side-by-Side Panels Grid (Compact layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Panel: Core Details (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-[#F0E6E6] shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-[#C4092F] pb-2 border-b border-gray-100">
                <Info className="w-4 h-4" />
                <h2 className="font-heading text-sm font-bold text-[#111111]">
                  Core Details
                </h2>
              </div>

              {/* Watch Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Watch Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Chronographe Royal 1952"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FFF5F5] border border-[#FFD0D0] rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#C4092F] focus:bg-white transition-all"
                />
              </div>

              {/* Price (IND) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Price (IND)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#FFF5F5] border border-[#FFD0D0] rounded-lg pl-7 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#C4092F] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Badge Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Collection Badge (Optional)
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-[#FFF5F5] border border-[#FFD0D0] rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#C4092F] cursor-pointer"
                >
                  <option value="Heritage Collection">Heritage Collection</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Limited Edition">Limited Edition</option>
                  <option value="Signature Series">Signature Series</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter detailed specifications and heritage narrative..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FFF5F5] border border-[#FFD0D0] rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#C4092F] focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Right Panel: Product Media (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-[#F0E6E6] shadow-2xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-[#C4092F] pb-2 border-b border-gray-100 mb-3">
                  <ImageIcon className="w-4 h-4" />
                  <h2 className="font-heading text-sm font-bold text-[#111111]">
                    Product Media
                  </h2>
                </div>

                {/* Drag & Drop Upload Zone */}
                <div className="relative border-2 border-dashed border-[#FFC0C0] bg-[#FFF8F8] rounded-xl p-4 text-center hover:bg-[#FFF0F0] transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[170px]">
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />

                  {imagePreview ? (
                    <div className="relative w-full h-36 flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain rounded-md shadow-2xs"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-[#FFEAEB] rounded-xl flex items-center justify-center text-[#C4092F] mb-2 border border-[#FFC5C5]">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-xs font-bold text-gray-800 mb-0.5">
                        Drag & Drop Images
                      </h3>
                      <p className="text-[10px] text-gray-500 max-w-xs mb-2 leading-relaxed">
                        Upload high-resolution photography. JPEG or PNG up to 10MB.
                      </p>
                      <span className="text-xs font-bold text-[#C4092F] underline hover:text-[#A00725]">
                        Browse Files
                      </span>
                    </>
                  )}
                </div>

                {/* Or Image URL Input */}
                <div className="mt-3">
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    Or paste direct Image URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value) setImagePreview(e.target.value);
                    }}
                    className="w-full bg-[#FFF5F5] border border-[#FFD0D0] rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#C4092F]"
                  />
                </div>
              </div>

              <div className="text-center pt-1">
                <p className="text-[10px] text-gray-400 font-medium">
                  {imagePreview || imageUrl ? "Image ready for publish." : "No images uploaded yet."}
                </p>
              </div>
            </div>

          </div>

          {statusMsg && (
            <p className="text-xs font-semibold text-[#C4092F] text-center">
              {statusMsg}
            </p>
          )}

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#F0E6E6]">
            <button
              type="button"
              onClick={() => navigate('/admin/orders')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold px-6 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C4092F] hover:bg-[#A00725] text-white text-xs font-semibold px-6 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              {isSubmitting ? "Publishing..." : "Publish Watch to Store"}
            </button>
          </div>

        </form>

        {/* Success Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 bg-[#111111] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold border border-gray-800">
            <CheckCircle2 className="w-4 h-4 text-[#FF9C9A]" />
            Watch published successfully to catalog!
          </div>
        )}
      </main>
    </div>
  );
}
