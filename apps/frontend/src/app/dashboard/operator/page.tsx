'use client';

import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function OperatorDashboard() {
  const stats = [
    { label: 'Revenus du mois', value: '1.250.000 FCFA', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Réservations actives', value: '24', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Visiteurs uniques', value: '1,450', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Taux de conversion', value: '4.2%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const recentBookings = [
    { id: 1, user: 'Arnaud Makosso', listing: 'Suite Royale - Grand Hotel', date: '28 Avril 2026', amount: '150.000 FCFA', status: 'Payé' },
    { id: 2, user: 'Sarah Kimpolo', listing: 'Table 4 pers - Mami Wata', date: '27 Avril 2026', amount: '45.000 FCFA', status: 'En attente' },
    { id: 3, user: 'Jean Mviri', listing: 'Excursion Gorges de Diosso', date: '27 Avril 2026', amount: '25.000 FCFA', status: 'Payé' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bienvenue, Opérateur</h1>
          <p className="text-subtext">Voici ce qui se passe dans votre établissement aujourd'hui.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          Nouvelle Annonce
        </button>
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
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground text-sm">{booking.user}</p>
                      <p className="text-xs text-subtext">{booking.date}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{booking.listing}</td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'Payé' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
