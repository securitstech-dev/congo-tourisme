'use client';

import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Plus,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function OperatorDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/operators/stats'),
          api.get('/bookings/operator')
        ]);

        const statsData = [
          { label: 'Revenus du mois', value: `${statsRes.data.revenue.toLocaleString()} FCFA`, icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Réservations actives', value: statsRes.data.bookings.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Visiteurs uniques', value: statsRes.data.visitors.toLocaleString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Taux de conversion', value: `${statsRes.data.conversion}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
        ];

        setStats(statsData);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bienvenue, Opérateur</h1>
          <p className="text-subtext">Voici ce qui se passe dans votre établissement aujourd'hui.</p>
        </div>
        <Link 
          href="/dashboard/operator/listings/new"
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Annonce
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-subtext uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-foreground">Réservations récentes</h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              Tout voir <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-accent/10">
                  <th className="px-6 py-4 text-xs font-bold text-subtext uppercase">Client</th>
                  <th className="px-6 py-4 text-xs font-bold text-subtext uppercase">Offre</th>
                  <th className="px-6 py-4 text-xs font-bold text-subtext uppercase">Montant</th>
                  <th className="px-6 py-4 text-xs font-bold text-subtext uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-subtext">
                      Aucune réservation récente.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-accent/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground text-sm">{booking.tourist?.firstName} {booking.tourist?.lastName}</p>
                        <p className="text-xs text-subtext">{format(new Date(booking.createdAt), 'dd MMMM yyyy', { locale: fr })}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{booking.listing?.title}</td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">{booking.totalPrice.toLocaleString()} FCFA</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {booking.paymentStatus === 'PAID' ? 'Payé' : 'En attente'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Passez au Premium</h3>
              <p className="text-white/80 text-sm mb-4">Augmentez votre visibilité de 40% et gérez plus de réservations.</p>
              <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all">
                Voir les offres
              </button>
            </div>
            <TrendingUp className="absolute bottom-[-10px] right-[-10px] w-32 h-32 text-white/10" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Conseil du jour</h3>
            <p className="text-sm text-subtext italic leading-relaxed">
              "Ajoutez des photos de haute qualité de vos établissements pour attirer plus de touristes. Les annonces avec plus de 5 photos reçoivent 3x plus de réservations."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
