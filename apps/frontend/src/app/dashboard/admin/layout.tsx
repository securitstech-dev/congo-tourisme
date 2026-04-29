'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && (!isAuthenticated || user?.role !== 'ADMIN')) {
      // router.push('/auth/login');
    }
  }, [isAuthenticated, user, router, mounted]);

  if (!mounted) return <div className="flex h-screen items-center justify-center bg-[#F0F2F5]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Supervision', href: '/dashboard/admin' },
    { icon: ShieldCheck, label: 'Validation Opérateurs', href: '/dashboard/admin/operators' },
    { icon: MapPin, label: 'Modération Annonces', href: '/dashboard/admin/listings' },
    { icon: CreditCard, label: 'Revenus & Abonnements', href: '/dashboard/admin/revenue' },
    { icon: Users, label: 'Utilisateurs', href: '/dashboard/admin/users' },
  ];

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1A1A1A] flex flex-col text-white">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none tracking-tight">Securits Tech</h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3 px-6 py-4 text-white/60 font-bold rounded-2xl hover:bg-white/5 hover:text-white transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-all" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-6 py-4 text-red-400 font-bold rounded-2xl hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white flex items-center justify-between px-10 shadow-sm z-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input 
              type="text" 
              placeholder="Rechercher partout..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-3 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-4 border-white"></span>
            </button>
            
            <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">{user?.firstName} {user?.lastName}</p>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Super Admin</span>
              </div>
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
                 S
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
