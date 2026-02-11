import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast'; // Import Toast
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Shirt } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false); // Error state for shake
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  // Fake Login logic for testing
  if (email === "admin@gmail.com" && password === "123") {
      toast.success('Bypass Login Successful!');
      localStorage.setItem('token', 'fake-token-123'); // Fake token
      setTimeout(() => navigate('/dashboard'), 1000);
  } else {
      // Real API logic (Jo humne pehle likha tha)
      try {
        const res = await axios.post('https://reqres.in/api/login', { email, password });
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } catch (err) {
        setIsError(true);
        toast.error('Galti ho gayi bhai! Sahi creds dalo.');
        setTimeout(() => setIsError(false), 500);
      }
  }
  setIsLoading(false);
};

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <Toaster position="top-right" /> {/* Toast Container */}
      
      {/* LEFT SIDE: Branding (Same as before) */}
      <div className="relative hidden w-1/2 bg-slate-900 lg:block">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070')] bg-cover bg-center opacity-40"></div>
         <div className="relative z-10 flex h-full flex-col p-12 text-white">
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <div className="rounded-lg bg-indigo-600 p-2"><Shirt size={24} /></div>
                <span>U & Me</span>
            </div>
            <div className="mt-auto">
                <h1 className="text-5xl font-semibold leading-tight">Manage your showroom <br /> with precision.</h1>
            </div>
         </div>
      </div>

      {/* RIGHT SIDE: Login Form with SHAKE Animation */}
      <div className="flex w-full items-center justify-center lg:w-1/2 p-8">
        <motion.div 
          animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}} // Shake Logic
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
            <p className="mt-2 text-slate-500">Please enter your showroom credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" required placeholder="eve.holt@reqres.in"
                  className={`w-full rounded-xl border py-4 pl-11 pr-4 outline-none transition-all ${isError ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100'}`}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className={`w-full rounded-xl border py-4 pl-11 pr-4 outline-none transition-all ${isError ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100'}`}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 font-bold text-white shadow-xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 transition-all"
            >
              {isLoading ? "Verifying..." : "Access Dashboard"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;