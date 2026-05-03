'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard as Layout, 
  Users, 
  FileCheck, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell,
  ShieldCheck as Shield,
  Building2,
  CreditCard,
  BookOpen
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
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      // router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  if (!mounted) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const menuItems = [
    { icon: Layout, label: 'Tableau de bord', href: '/dashboard/admin' },
    { icon: Users, label: 'Opérateurs', href: '/dashboard/admin/validations' },
    { icon: CreditCard, label: 'Finance & Stats', href: '/dashboard/admin/settings' },
    { icon: BookOpen, label: 'Mode d\'emploi', href: '/dashboard/admin/manual' },
    { icon: Shield, label: 'Système', href: '/dashboard/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-accent/20 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-foreground">Admin CT</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-subtext font-medium rounded-xl hover:bg-accent hover:text-secondary transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-foreground">Administration Securits Tech</h2>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-subtext hover:bg-accent rounded-full transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-subtext">Super Administrateur</p>
              </div>
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                {user?.firstName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
