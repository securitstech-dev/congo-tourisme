'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  CalendarCheck, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Settings,
  Bell
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingOperators, setPendingOperators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, pendingRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/operators/pending')
        ]);
        setStats(statsRes.data);
        setPendingOperators(pendingRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données admin:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleValidate = async (id: string) => {
    if (!confirm('Voulez-vous vraiment valider cet opérateur ?')) return;
    try {
      await api.patch(`/admin/operators/${id}/validate`);
      setPendingOperators(prev => prev.filter(op => op.id !== id));
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      alert('Erreur lors de la validation.');
    }
  };

  const statCards = [
    { label: 'Opérateurs', value: stats?.operators || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Annonces', value: stats?.listings || 0, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Réservations', value: stats?.bookings || 0, icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Revenus Plateforme', value: `${(stats?.revenue || 0).toLocaleString()} FCFA`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord Super Admin</h1>
        <p className="text-subtext">Pilotez la croissance et la conformité de la plateforme Congo Tourisme.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-primary text-white' : 'bg-white text-subtext hover:bg-accent/50'}`}
        >
          Vue d'ensemble
        </button>
        <button 
          onClick={() => setActiveTab('operators')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'operators' ? 'bg-primary text-white' : 'bg-white text-subtext hover:bg-accent/50'}`}
        >
          Gestion des Opérateurs
        </button>
        <button 
          onClick={() => setActiveTab('transactions')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'transactions' ? 'bg-primary text-white' : 'bg-white text-subtext hover:bg-accent/50'}`}
        >
          Transactions Financières
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-subtext uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-black text-foreground">{isLoading ? '...' : stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Validations */}
            <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Opérateurs en attente de validation
                </h3>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                  {pendingOperators.length} Nouveau{pendingOperators.length > 1 ? 'x' : ''}
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {isLoading ? (
                  <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : pendingOperators.length === 0 ? (
                  <div className="p-12 text-center text-subtext font-medium">Aucune demande en attente.</div>
                ) : (
                  pendingOperators.map((op) => (
                    <div key={op.id} className="p-6 hover:bg-accent/5 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary font-bold">
                          {op.businessName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{op.businessName}</p>
                          <p className="text-sm text-subtext">{op.user?.email} • {op.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleValidate(op.id)}
                          className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all shadow-sm border border-green-100"
                          title="Valider"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm border border-red-100"
                          title="Rejeter"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* System Health / Quick Info */}
            <div className="space-y-6">
              <div className="bg-secondary p-8 rounded-[32px] text-white shadow-xl shadow-secondary/20 relative overflow-hidden">
                <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                <h4 className="text-lg font-bold mb-4">Statut Système</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">Base de données</span>
                    <span className="flex items-center gap-1 font-bold"><div className="w-2 h-2 bg-green-400 rounded-full"></div> En ligne</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">Serveur API</span>
                    <span className="flex items-center gap-1 font-bold"><div className="w-2 h-2 bg-green-400 rounded-full"></div> Stable</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">Stockage Cloudinary</span>
                    <span className="flex items-center gap-1 font-bold"><div className="w-2 h-2 bg-green-400 rounded-full"></div> OK</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h4 className="text-lg font-bold text-foreground mb-4">Actions Rapides</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-accent/20 rounded-2xl hover:bg-accent/40 transition-all text-center group">
                    <div className="w-10 h-10 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Notifier</span>
                  </button>
                  <button className="p-4 bg-accent/20 rounded-2xl hover:bg-accent/40 transition-all text-center group">
                    <div className="w-10 h-10 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Maintenance</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'operators' && (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Tous les Opérateurs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-subtext text-sm">
                  <th className="pb-4 font-bold">Entreprise</th>
                  <th className="pb-4 font-bold">Type</th>
                  <th className="pb-4 font-bold">Ville</th>
                  <th className="pb-4 font-bold">Statut</th>
                  <th className="pb-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Simulated list, since we don't have a specific endpoint fetched here yet */}
                {pendingOperators.map((op) => (
                  <tr key={op.id} className="text-sm">
                    <td className="py-4 font-bold text-foreground">{op.businessName}</td>
                    <td className="py-4 text-subtext">{op.businessType}</td>
                    <td className="py-4 text-subtext">{op.city}</td>
                    <td className="py-4">
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">En attente</span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-primary font-bold hover:underline">Gérer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px]">
          <TrendingUp className="w-12 h-12 text-primary opacity-20 mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Transactions Récentes</h2>
          <p className="text-subtext">Historique des paiements Stripe et Mobile Money (Bientôt disponible).</p>
        </div>
      )}
    </div>
  );
}
