import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, handleLogout, activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Overview" },
    { icon: Package, label: "Inventory" },
    { icon: ShoppingCart, label: "Orders" },
    { icon: Users, label: "Customers" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between px-8">
          <span className="text-xl font-bold tracking-tight text-indigo-600 italic">VASTRA.</span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400"><X size={20} /></button>
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <div 
              key={item.label}
              onClick={() => {
                setActiveTab(item.label);
                setIsOpen(false); // Mobile par click karte hi band ho jaye
              }}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                activeTab === item.label 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' // Active Style
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900' // Inactive Style
              }`}
            >
              <item.icon size={18} strokeWidth={activeTab === item.label ? 2.5 : 2} /> 
              <span className={`text-sm ${activeTab === item.label ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-8 w-full px-4 border-t border-slate-50 pt-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={18} /> <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;