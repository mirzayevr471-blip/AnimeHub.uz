import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Play, ShieldCheck, MailCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google orqali kirishda xatolik');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await signup(formData);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0c] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                <Play className="w-8 h-8 text-purple-500 fill-current" />
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2">Ro'yxatdan o'tish</h1>
              <p className="text-gray-500 text-sm font-medium">AniHub oilasiga xush kelibsiz!</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-xs font-bold mb-6 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">To'liq ismingiz</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masalan: Azizbek"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-purple-500 transition-all text-white placeholder:text-gray-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Manzil</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@misol.uz"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-purple-500 transition-all text-white placeholder:text-gray-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Parol yaratish</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-purple-500 transition-all text-white placeholder:text-gray-700 font-medium font-mono"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 px-1 py-2">
                 <div className="w-5 h-5 bg-purple-500/10 border border-purple-500/20 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-purple-500" />
                 </div>
                 <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                   Ro'yxatdan o'tish orqali siz bizning <span className="text-purple-400">Xizmat ko'rsatish shartlari</span> va <span className="text-purple-400">Maxfiylik siyosatimizga</span> rozilik bildirasiz.
                 </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-purple-900/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    HISOIB YARATISH
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-[#0a0a0c] px-4 text-gray-700 font-black">Yoki</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleSubmitting}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isGoogleSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <GoogleIcon />
                    Google orqali ro'yxatdan o'tish
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Akkauntingiz bormi?{' '}
                <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Kirish</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
