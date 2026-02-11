import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AddProductModal = ({ onClose, onProductAdded, editingProduct, onProductUpdated }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    price: '', 
    category: '', 
    image: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Agar Edit kar rahe hain toh purana data bharo
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title,
        price: editingProduct.price,
        category: editingProduct.category,
        image: editingProduct.image
      });
    }
  }, [editingProduct]);

  // 2. IMAGE UPLOAD LOGIC (File ko Text mein badalna)
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            // --- IMAGE COMPRESSION LOGIC ---
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 600; // Hum photo ko 600px se bada nahi rakhenge
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Quality ko 0.7 (70%) kar diya, isse 3MB ki photo 150KB ki ho jayegi
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setFormData({ ...formData, image: compressedBase64 });
          };
        };
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Edit Logic
        onProductUpdated({ ...editingProduct, ...formData, price: Number(formData.price) });
        toast.success("Product Updated!");
      } else {
        // Add Logic (Hamara Local Storage wala)
        const newProduct = {
          ...formData,
          id: Date.now(), // Unique ID
          price: Number(formData.price)
        };
        onProductAdded(newProduct);
        toast.success("Product Added Successfully!");
      }
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <X className="cursor-pointer text-slate-400 hover:text-slate-600" onClick={onClose} />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* IMAGE UPLOAD SECTION */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product Photo</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
                {formData.image ? (
                  <img src={formData.image} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-slate-300" />
                )}
              </div>
              <input 
                type="file" accept="image/*" 
                onChange={handleImageChange}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
            <input 
              required value={formData.title}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="e.g. Nike Air Max"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price ($)</label>
              <input 
                type="number" required value={formData.price}
                className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="0.00"
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <input 
                list="cats" value={formData.category}
                className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Category"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
              <datalist id="cats">
                <option value="Footwear" /><option value="Clothing" /><option value="Jewelery" /><option value="Electronics" />
              </datalist>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98]">
            {isSubmitting ? "Processing..." : editingProduct ? "Update Product" : "Publish Product"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddProductModal;