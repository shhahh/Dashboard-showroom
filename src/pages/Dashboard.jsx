import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Menu, Plus, Loader2, Package, 
  ShoppingCart, BarChart3, Target, Edit2, Trash2 
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components Import
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import AddProductModal from '../components/AddProductModal';

const Dashboard = () => {
  // --- SARE HOOKS (STATES) FUNCTION KE ANDAR HAIN ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('vastra_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(products.length === 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Inventory'); // Active Tab State

  const navigate = useNavigate();

  // 1. Data Fetching Logic
  useEffect(() => {
    if (products.length === 0) {
      const getInventory = async () => {
        try {
          const res = await axios.get('https://fakestoreapi.com/products?limit=8');
          setProducts(res.data);
          localStorage.setItem('vastra_inventory', JSON.stringify(res.data));
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
      };
      getInventory();
    } else {
      setLoading(false);
    }
  }, []);

  // 2. LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('vastra_inventory', JSON.stringify(products));
  }, [products]);

  // 3. Handlers
  const handleDelete = (id) => {
    if (window.confirm("Delete item?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleUpdate = (updatedItem) => {
    const newList = products.map((p) => (p.id === updatedItem.id ? updatedItem : p));
    setProducts(newList);
  };

      // Smart Filtering Logic
      const filteredProducts = products.filter(p => {
        // 1. Search match hona chahiye
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 2. Category match honi chahiye (Agar activeTab 'Inventory' hai toh sab dikhao)
        const matchesCategory = activeTab === 'Inventory' 
          ? true 
          : p.category.toLowerCase() === activeTab.toLowerCase();

        return matchesSearch && matchesCategory;
      });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* SIDEBAR */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={() => { localStorage.removeItem('token'); navigate('/login'); }} 
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full lg:pl-64">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 md:px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-600">
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block w-72 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" placeholder="Search inventory..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg bg-slate-100 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-full bg-slate-100 p-2 text-slate-600 cursor-pointer hover:bg-slate-200"><Bell size={18} /></div>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-100">A</div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="p-4 md:p-8">
          
          { (activeTab === 'Inventory' || activeTab === 'Footwear' || activeTab === 'Clothing') ? (
            <>
              <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Inventory</h1>
                  <p className="text-sm text-slate-500">Manage premium collection</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  <Plus size={18} /> Add Product
                </button>
              </div>

              {/* STATS CARDS */}
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Inventory" value={products.length} icon={Package} trend="+2 new" />
                <StatCard title="Inventory Value" value={`$${products.reduce((a,c) => a + Number(c.price || 0), 0).toFixed(0)}`} icon={BarChart3} trend="+12%" />
                <StatCard title="Active Results" value={filteredProducts.length} icon={Target} />
              </div>

              {/* TABLE */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Product</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="mx-auto animate-spin text-indigo-600" /></td></tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr><td colSpan="4" className="py-20 text-center text-slate-400">No products found.</td></tr>
                      ) : (
                        filteredProducts.map((item) => (
                          <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={item.image} className="h-10 w-10 rounded-lg object-contain bg-white border p-1" alt=""/>
                                <span className="font-medium text-slate-800 text-sm truncate max-w-[150px]">{item.title}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                               <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-200">{item.category}</span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">${item.price}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => { setEditingProduct(item); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16}/></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* COMING SOON SECTION */
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
               <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                  <Package size={40} className="text-indigo-400 opacity-50" />
               </div>
               <h2 className="text-2xl font-bold text-slate-700 mb-2">{activeTab} Section</h2>
               <p className="text-slate-500 max-w-sm mx-auto">
                 We are currently building the <span className="text-indigo-600 font-semibold">{activeTab}</span> dashboard. Stay tuned!
               </p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <AddProductModal 
            onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
            onProductAdded={(newP) => setProducts([newP, ...products])} 
            onProductUpdated={handleUpdate}
            editingProduct={editingProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;