'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { 
  Menu, 
  User, 
  Map, 
  LayoutDashboard, 
  LogOut, 
  ChevronDown,
  Bell,
  Settings,
  HelpCircle,
  CreditCard,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { isAuthenticated: isAuth, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthenticated = mounted ? isAuth : false;

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') return '/dashboard/admin';
    if (user?.role === 'OPERATOR') return '/dashboard/operator';
    return '/dashboard/tourist';
  };

  const navLinks = [
    { label: 'Explorer', href: '/explore' },
    { label: 'Hébergements', href: '/explore?type=HOTEL' },
    { label: 'Activités', href: '/explore?type=LEISURE_ACTIVITY' },
    { label: 'Tarifs', href: '/pricing' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/70 backdrop-blur-2xl border-b border-gray-100 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: -10 }}
            className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Map className="text-white w-6 h-6" />
          </motion.div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">TOURISME</span>
              <span className="text-xl font-black tracking-tighter leading-none text-secondary">CONGO</span>
            </div>
            <span className="text-[8px] font-bold text-subtext tracking-widest leading-none mt-1 uppercase">Le portail du tourisme et des loisirs</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-100/50 backdrop-blur-md p-1.5 rounded-[20px] border border-white/20">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="px-6 py-2.5 rounded-[14px] text-sm font-bold text-subtext hover:text-primary hover:bg-white transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-subtext hover:bg-accent/30 transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 bg-white border border-gray-100 p-1.5 pr-4 rounded-2xl hover:shadow-lg transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-foreground max-w-[100px] truncate">
                    {user?.firstName}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-subtext transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 mb-2">
                        <p className="text-xs font-bold text-subtext uppercase tracking-widest mb-1">Connecté en tant que</p>
                        <p className="font-bold text-foreground truncate">{user?.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <Link href={getDashboardLink()} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-subtext hover:text-primary hover:bg-accent/30 transition-all">
                          <LayoutDashboard className="w-4 h-4" />
                          Tableau de bord
                        </Link>
                        {user?.role === 'OPERATOR' && (
                          <Link href="/dashboard/operator/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-subtext hover:text-primary hover:bg-accent/30 transition-all">
                            <CreditCard className="w-4 h-4" />
                            Mon Abonnement
                          </Link>
                        )}
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-subtext hover:text-primary hover:bg-accent/30 transition-all">
                          <Settings className="w-4 h-4" />
                          Paramètres
                        </Link>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-50">
                        <button 
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/auth/login"
                className="px-6 py-3 font-bold text-foreground hover:text-primary transition-colors text-sm"
              >
                Connexion
              </Link>
              <Link 
                href="/auth/register"
                className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                Rejoindre
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-foreground"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Fullscreen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[100] lg:hidden flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Map className="text-white w-6 h-6" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">TOURISME</span>
                    <span className="text-xl font-black tracking-tighter leading-none text-secondary">CONGO</span>
                  </div>
                  <span className="text-[8px] font-bold text-subtext tracking-widest leading-none mt-1 uppercase">Le portail du tourisme et des loisirs</span>
                </div>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-subtext uppercase tracking-widest ml-1">Menu</p>
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-3xl font-black text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-50">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href={getDashboardLink()} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 text-xl font-bold text-foreground"
                    >
                      <LayoutDashboard className="w-6 h-6 text-primary" />
                      Tableau de bord
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-4 text-xl font-bold text-red-500"
                    >
                      <LogOut className="w-6 h-6" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <Link 
                      href="/auth/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-5 rounded-2xl border-2 border-gray-100 text-center font-bold text-lg"
                    >
                      Connexion
                    </Link>
                    <Link 
                      href="/auth/register" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-5 rounded-2xl bg-primary text-white text-center font-bold text-lg shadow-xl shadow-primary/20"
                    >
                      Rejoindre la plateforme
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-gray-50 text-center">
              <p className="text-sm text-subtext font-medium">© {new Date().getFullYear()} Congo Tourisme. By Securits Tech.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
