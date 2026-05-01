'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Menu, User, Map, LayoutDashboard, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAuthenticated: isAuth, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = mounted ? isAuth : false;

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') return '/dashboard/admin';
    if (user?.role === 'OPERATOR') return '/dashboard/operator';
    return '/dashboard/tourist';
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-primary px-2 py-1 rounded-lg text-white">CONGO</span>
            <span className="text-foreground">TOURISME</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/explore" className="font-bold text-subtext hover:text-primary transition-colors">
              Explorer
            </Link>
            <Link href="/explore?type=HOTEL" className="font-bold text-subtext hover:text-primary transition-colors">
              Hébergements
            </Link>
            <Link href="/explore?type=SITE" className="font-bold text-subtext hover:text-primary transition-colors">
              Sites
            </Link>
            <Link href="/explore?type=NIGHTCLUB" className="font-bold text-subtext hover:text-primary transition-colors">
              Boîtes de Nuit
            </Link>
            
            <div className="w-px h-6 bg-gray-200"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  href={getDashboardLink()}
                  className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Tableau de bord
                </Link>
                <button 
                  onClick={logout}
                  className="w-10 h-10 rounded-full bg-accent/30 text-subtext flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/auth/login"
                  className="font-bold text-foreground hover:text-primary transition-colors"
                >
                  Se connecter
                </Link>
                <Link 
                  href="/auth/register"
                  className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4 shadow-xl">
          <Link href="/explore" className="block font-bold text-foreground py-2">Explorer</Link>
          <Link href="/explore?type=NIGHTCLUB" className="block font-bold text-foreground py-2">Boîtes de Nuit</Link>
          <hr className="border-gray-50" />
          {isAuthenticated ? (
            <>
              <Link href={getDashboardLink()} className="block font-bold text-primary py-2">Mon Tableau de bord</Link>
              <button onClick={logout} className="block font-bold text-red-500 py-2 text-left w-full">Déconnexion</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block font-bold text-foreground py-2">Se connecter</Link>
              <Link href="/auth/register" className="block font-bold text-primary py-2">S'inscrire</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
