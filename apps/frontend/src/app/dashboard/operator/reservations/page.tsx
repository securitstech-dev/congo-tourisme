'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function OperatorReservationsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/operator');
        setBookings(response.data);
      } catch (error) {
        console.error('Erreur rcupration rservations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return { text: 'Confirmée', bg: 'bg-green-100', color: 'text-green-600' };
      case 'PENDING': return { text: 'En attente', bg: 'bg-orange-100', color: 'text-orange-600' };
      case 'CANCELLED': return { text: 'Annulée', bg: 'bg-red-100', color: 'text-red-600' };
      default: return { text: status, bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  const filteredBookings = bookings.filter(b => filter === 'ALL' || b.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Réservations</h1>
          <p className="text-subtext">Consultez et gérez toutes les demandes de vos clients.</p>
        </div>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 font-bold text-sm shadow-sm hover:bg-accent/10 transition-all">
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
          <input 
            type="text" 
            placeholder="Rechercher par client ou offre..." 
            className="w-full pl-12 pr-4 py-3 bg-accent/20 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === s ? 'bg-primary text-white' : 'bg-accent/10 text-subtext hover:bg-accent/20'
              }`}
            >
              {s === 'ALL' ? 'Tous' : s === 'PENDING' ? 'En attente' : s === 'CONFIRMED' ? 'Confirmé' : 'Annulé'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-20 text-center">
            <Calendar className="w-12 h-12 text-subtext/20 mx-auto mb-4" />
            <p className="text-subtext font-bold">Aucune réservation trouvée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-accent/5 text-subtext text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Hébergement / Offre</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((b) => {
                  const status = getStatusStyle(b.status);
                  return (
                    <tr key={b.id} className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                            {b.tourist?.firstName.charAt(0)}{b.tourist?.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{b.tourist?.firstName} {b.tourist?.lastName}</p>
                            <p className="text-[10px] text-subtext">{b.tourist?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-foreground">{b.listing?.title}</p>
                        <p className="text-[10px] text-subtext uppercase tracking-wider">{b.listing?.type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {format(new Date(b.checkIn), 'dd MMM', { locale: fr })} - {format(new Date(b.checkOut), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-black text-primary text-sm">{b.totalPrice.toLocaleString()} FCFA</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.bg} ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-accent/20 rounded-lg transition-all text-subtext">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
