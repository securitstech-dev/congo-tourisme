'use client';

import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Plus,
  Loader2,
  BadgeCheck,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function OperatorDashboard() {
  const [data, setData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/operators/stats'),
          api.get('/bookings/operator')
        ]);

        setData(statsRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: 'Revenus du mois', value: `${data?.revenue?.toLocaleString() || 0} FCFA`, icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Réservations actives', value: data?.bookings?.toString() || '0', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Visiteurs uniques', value: data?.visitors?.toLocaleString() || '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Taux de conversion', value: `${data?.conversion || 0}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const sub = data?.subscription;
  const daysRemaining = sub?.endDate ? differenceInDays(new Date(sub.endDate), new Date()) : 0;
  const progressWidth = daysRemaining > 0 ? Math.min(100, (daysRemaining / 30) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bienvenue, Opérateur</h1>
          <p className="text-subtext">Voici ce qui se passe dans votre établissement aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-3">
           {!sub?.isValidated && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-xs font-bold border border-orange-200">
              <Clock className="w-4 h-4" />
              Compte en attente de validation
            </div>
          )}
          <Link 
            href="/dashboard/operator/listings/new"
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Annonce
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-subtext uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-foreground uppercase tracking-tight">Réservations récentes</h3>
            <Link 
              href="/dashboard/operator/reservations" 
              className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
            >
              Voir tout le carnet <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-accent/5">
                    <th className="px-8 py-4 text-[10px] font-black text-subtext uppercase tracking-widest">Client</th>
                    <th className="px-8 py-4 text-[10px] font-black text-subtext uppercase tracking-widest">Offre</th>
                    <th className="px-8 py-4 text-[10px] font-black text-subtext uppercase tracking-widest">Montant</th>
                    <th className="px-8 py-4 text-[10px] font-black text-subtext uppercase tracking-widest">Paiement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <Calendar className="w-12 h-12 text-subtext/20 mx-auto mb-4" />
                        <p className="text-subtext font-bold">Aucune réservation pour le moment.</p>
                      </td>
                    </tr>
                  ) : (
                    bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id} className="hover:bg-accent/5 transition-colors">
                        <td className="px-8 py-5">
                          <p className="font-bold text-foreground text-sm">{booking.tourist?.firstName} {booking.tourist?.lastName}</p>
                          <p className="text-[10px] text-subtext font-medium">{format(new Date(booking.createdAt), 'dd MMMM yyyy', { locale: fr })}</p>
                        </td>
                        <td className="px-8 py-5 text-sm text-foreground font-bold">{booking.listing?.title}</td>
                        <td className="px-8 py-5 text-sm font-black text-primary">{booking.totalPrice.toLocaleString()} FCFA</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {booking.paymentStatus === 'PAID' ? '✓ Payé' : '⏳ Attente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-10 h-10 text-subtext/20 mx-auto mb-3" />
                  <p className="text-subtext font-bold text-sm">Aucune réservation.</p>
                </div>
              ) : (
                bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-foreground">
                          {booking.tourist?.firstName} {booking.tourist?.lastName}
                        </p>
                        <p className="text-[10px] text-subtext">
                          {format(new Date(booking.createdAt), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {booking.paymentStatus === 'PAID' ? 'Payé' : 'Attente'}
                      </span>
                    </div>
                    <div className="bg-accent/5 p-3 rounded-2xl">
                      <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Offre</p>
                      <p className="text-xs font-bold text-foreground truncate">{booking.listing?.title}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-black text-primary">
                        {booking.totalPrice.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Status Panels */}
        <div className="space-y-6">
          {/* Subscription Panel */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm border-l-8 border-l-secondary relative overflow-hidden">
            <h3 className="font-black text-foreground uppercase tracking-tight mb-6">Abonnement</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-subtext">Plan :</span>
                <span className="px-3 py-1 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-secondary/20">
                  {sub?.plan || 'STARTER'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-subtext">Statut :</span>
                {daysRemaining > 0 ? (
                  <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4" /> Actif
                  </span>
                ) : (
                  <span className="text-sm font-bold text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Expiré
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black text-subtext uppercase tracking-widest">
                  <span>Usage</span>
                  <span>{daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Expiré'}</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-50">
                  <div 
                    className={`h-full transition-all duration-1000 ${daysRemaining < 5 ? 'bg-red-500' : 'bg-secondary'}`}
                    style={{ width: `${progressWidth}%` }} 
                  />
                </div>
              </div>

              {daysRemaining < 5 && (
                <button className="w-full bg-secondary text-white font-black py-4 rounded-2xl hover:opacity-90 transition-all text-xs uppercase tracking-widest shadow-xl shadow-secondary/20">
                  Renouveler maintenant
                </button>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-foreground p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
            <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="font-bold text-lg mb-2 relative z-10">Optimisez vos ventes</h3>
            <p className="text-white/60 text-sm mb-6 relative z-10 leading-relaxed">
              "Ajoutez des photos de haute qualité de vos établissements. Les annonces avec plus de 5 photos reçoivent 3x plus de réservations."
            </p>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-widest">
              Voir les conseils
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
