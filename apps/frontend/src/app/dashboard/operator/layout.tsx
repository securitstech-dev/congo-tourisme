'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  CalendarCheck, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell,
  User as UserIcon,
  MessageSquare,
  Landmark,
  Receipt
} from 'lucide-react';
import Link from 'next/link';

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const isOnboarding = pathname === '/dashboard/operator/onboarding';

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || user?.role !== 'OPERATOR') {
      // router.push('/auth/login');
    }

    // Redirection automatique vers l'onboarding si non validé
    if (mounted && user && !user.operator?.isValidated && !isOnboarding) {
      router.push('/dashboard/operator/onboarding');
    }
  }, [isAuthenticated, user, router, mounted, isOnboarding]);

  if (!mounted) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', href: '/dashboard/operator' },
    { icon: Store, label: 'Mes Annonces', href: '/dashboard/operator/listings' },
    { icon: CalendarCheck, label: 'Réservations', href: '/dashboard/operator/reservations' },
    { icon: MessageSquare, label: 'Commentaires', href: '/dashboard/operator/reviews' },
    { icon: BarChart3, label: 'Statistiques', href: '/dashboard/operator/stats' },
    { icon: Receipt, label: 'Facturation', href: '/dashboard/operator/billing' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/operator/settings' },
  ];

  return (
    <div className="flex h-screen bg-accent/20 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <img src="/logo.png" alt="Tourisme Congo" className="h-10 w-auto object-contain" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-subtext font-medium rounded-xl hover:bg-accent hover:text-primary transition-all group"
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
          <h2 className="text-xl font-bold text-foreground">Tableau de bord</h2>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-subtext hover:bg-accent rounded-full transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-subtext">Opérateur Touristique</p>
              </div>
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold">
                {user?.firstName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {(!user?.operator?.isValidated && !isOnboarding) && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border border-gray-100">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Compte en attente de validation</h2>
                <p className="text-subtext mb-6">Votre dossier est actuellement en cours d'examen par la direction de Securits Tech. Vous recevrez un email dès que votre compte sera activé.</p>
                <Link href="/" className="bg-accent text-primary px-6 py-3 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all">Retour à l'accueil</Link>
              </div>
            </div>
          )}
          
          {(user?.operator?.isValidated && user?.operator?.subscriptionEnd && new Date(user.operator.subscriptionEnd) < new Date()) && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
              <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border border-gray-100">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Abonnement Expiré</h2>
                <p className="text-subtext mb-6">Votre période d'essai ou d'abonnement est arrivée à terme. Pour continuer à publier et recevoir des réservations, veuillez renouveler votre abonnement.</p>
                <div className="space-y-3">
                  <button className="w-full bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
                    Payer via Mobile Money
                  </button>
                  <p className="text-xs text-subtext">Ou rendez-vous à la direction pour un paiement en espèces.</p>
                </div>
              </div>
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
