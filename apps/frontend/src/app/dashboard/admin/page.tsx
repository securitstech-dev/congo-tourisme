'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Building2, CalendarCheck, TrendingUp,
  Clock, CheckCircle, XCircle, Loader2,
  ShieldCheck, Settings, Bell, CreditCard,
  BadgeCheck, AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type Tab = 'overview' | 'operators' | 'transactions';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingOperators, setPendingOperators] = useState<any[]>([]);
  const [allOperators, setAllOperators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, pendingRes, allRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/operators/pending'),
        api.get('/admin/operators'),
      ]);
      setStats(statsRes.data);
      setPendingOperators(pendingRes.data);
      setAllOperators(allRes.data);
    } catch {
      // Erreur réseau gérée silencieusement
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleValidate = async (id: string) => {
    if (!confirm('Valider cet opérateur ? Il aura accès à toutes les fonctionnalités.')) return;
    setActionLoading(id);
    try {
      await api.patch(`/admin/operators/${id}/validate`);
      setPendingOperators(prev => prev.filter(op => op.id !== id));
      setAllOperators(prev => prev.map(op => op.id === id ? { ...op, isValidated: true } : op));
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch {
      alert('Erreur lors de la validation.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Rejeter cet opérateur ? Son compte sera désactivé.')) return;
    setActionLoading(id);
    try {
      await api.patch(`/admin/operators/${id}/reject`);
      setPendingOperators(prev => prev.filter(op => op.id !== id));
      setAllOperators(prev => prev.filter(op => op.id !== id));
    } catch {
      alert('Erreur lors du rejet.');
    } finally {
      setActionLoading(null);
    }
  };

  const statCards = [
    {
      label: 'Opérateurs actifs',
      value: `${stats?.validatedOperators || 0} / ${stats?.operators || 0}`,
      icon: Users, color: 'text-blue-600', bg: 'bg-blue-50',
      sub: `${stats?.operators - stats?.validatedOperators || 0} en attente`,
    },
    {
      label: 'Annonces publiées',
      value: stats?.listings || 0,
      icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50',
      sub: 'Sur toute la plateforme',
    },
    {
      label: 'Réservations du mois',
      value: stats?.monthBookings || 0,
      icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50',
      sub: `${stats?.bookings || 0} total cumulé`,
    },
    {
      label: 'Revenus du mois',
      value: `${(stats?.monthRevenue || 0).toLocaleString()} FCFA`,
      icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10',
      sub: `Total : ${(stats?.revenue || 0).toLocaleString()} FCFA`,
    },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Vue d\'ensemble' },
    { key: 'operators', label: 'Opérateurs' },
    { key: 'transactions', label: 'Transactions' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord Super Admin</h1>
        <p className="text-subtext">Pilotez la croissance et la conformité de Congo Tourisme — Securits Tech.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === t.key ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-subtext hover:bg-accent/50'
            }`}
          >
            {t.label}
            {t.key === 'operators' && pendingOperators.length > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full inline-flex items-center justify-center font-black">
                {pendingOperators.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ──── ONG VUE D'ENSEMBLE ──── */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-subtext uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl font-black text-foreground">{isLoading ? '...' : stat.value}</p>
                <p className="text-[10px] text-subtext mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Validations en attente */}
            <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Opérateurs en attente de validation
                </h3>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                  {pendingOperators.length} en attente
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {isLoading ? (
                  <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : pendingOperators.length === 0 ? (
                  <div className="p-12 text-center">
                    <BadgeCheck className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-subtext font-medium">Tout est à jour — aucune demande en attente.</p>
                  </div>
                ) : (
                  pendingOperators.map((op) => (
                    <div key={op.id} className="p-6 hover:bg-accent/5 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary font-bold text-lg">
                          {op.businessName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{op.businessName}</p>
                          <p className="text-sm text-subtext">{op.user?.email} · {op.city}</p>
                          <p className="text-[10px] text-subtext uppercase tracking-wider mt-1">
                            {op.businessType} · Plan {op.subscriptionPlan}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {actionLoading === op.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleValidate(op.id)}
                              className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-xl hover:bg-green-100 transition-all border border-green-100"
                            >
                              <CheckCircle className="w-4 h-4" /> Valider
                            </button>
                            <button
                              onClick={() => handleReject(op.id)}
                              className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-all border border-red-100"
                            >
                              <XCircle className="w-4 h-4" /> Rejeter
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Panneau latéral */}
            <div className="space-y-6">
              <div className="bg-secondary p-8 rounded-[32px] text-white shadow-xl shadow-secondary/20 relative overflow-hidden">
                <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                <h4 className="text-lg font-bold mb-4">Statut Système</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Base de données', status: 'En ligne' },
                    { label: 'Serveur API', status: 'Stable' },
                    { label: 'Cloudinary CDN', status: 'OK' },
                    { label: 'Chatbot Kongo', status: 'Actif' },
                  ].map(({ label, status }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="opacity-80">{label}</span>
                      <span className="flex items-center gap-1 font-bold">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        {status}
                      </span>
                    </div>
                  ))}
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
                    <span className="text-xs font-bold text-foreground">Config</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ──── ONGLET OPÉRATEURS ──── */}
      {activeTab === 'operators' && (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-foreground">Tous les Opérateurs</h2>
            <p className="text-subtext text-sm mt-1">{allOperators.length} opérateur(s) enregistré(s)</p>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-accent/5 text-subtext text-[10px] uppercase tracking-widest font-black">
                    <th className="px-8 py-4">Entreprise</th>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4">Ville</th>
                    <th className="px-8 py-4">Plan</th>
                    <th className="px-8 py-4">Annonces</th>
                    <th className="px-8 py-4">Statut</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allOperators.map((op) => (
                    <tr key={op.id} className="hover:bg-accent/5 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {op.businessName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{op.businessName}</p>
                            <p className="text-[10px] text-subtext">{op.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm text-subtext">{op.businessType}</td>
                      <td className="px-8 py-4 text-sm text-subtext">{op.city}</td>
                      <td className="px-8 py-4">
                        <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase rounded-lg">
                          {op.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm font-bold text-foreground">{op.listings?.length || 0}</td>
                      <td className="px-8 py-4">
                        {op.isValidated ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                            <BadgeCheck className="w-4 h-4" /> Validé
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-orange-500 text-xs font-bold">
                            <AlertCircle className="w-4 h-4" /> En attente
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-4 text-right">
                        {!op.isValidated && (
                          <div className="flex justify-end gap-2">
                            {actionLoading === op.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            ) : (
                              <>
                                <button onClick={() => handleValidate(op.id)} className="text-green-600 font-bold text-xs hover:underline">Valider</button>
                                <button onClick={() => handleReject(op.id)} className="text-red-500 font-bold text-xs hover:underline">Rejeter</button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ──── ONGLET TRANSACTIONS ──── */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-secondary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Transactions Récentes</h2>
              <p className="text-subtext text-sm">10 derniers paiements validés sur la plateforme</p>
            </div>
          </div>
          {isLoading ? (
            <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></div>
          ) : !stats?.recentPayments?.length ? (
            <div className="p-20 text-center">
              <TrendingUp className="w-12 h-12 text-subtext/20 mx-auto mb-4" />
              <p className="text-subtext font-medium">Aucune transaction enregistrée pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-accent/5 text-subtext text-[10px] uppercase tracking-widest font-black">
                    <th className="px-8 py-4">Client</th>
                    <th className="px-8 py-4">Offre</th>
                    <th className="px-8 py-4">Montant</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Méthode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentPayments.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-accent/5 transition-colors">
                      <td className="px-8 py-4">
                        <p className="font-bold text-sm text-foreground">
                          {payment.reservation?.tourist?.firstName} {payment.reservation?.tourist?.lastName}
                        </p>
                        <p className="text-[10px] text-subtext">{payment.reservation?.tourist?.email}</p>
                      </td>
                      <td className="px-8 py-4 text-sm text-foreground font-medium">
                        {payment.reservation?.listing?.title || '—'}
                      </td>
                      <td className="px-8 py-4">
                        <p className="font-black text-primary">{payment.amount?.toLocaleString()} FCFA</p>
                      </td>
                      <td className="px-8 py-4 text-sm text-subtext">
                        {payment.paidAt
                          ? format(new Date(payment.paidAt), 'dd MMM yyyy', { locale: fr })
                          : '—'}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          payment.method === 'STRIPE' ? 'bg-blue-100 text-blue-700' :
                          payment.method?.includes('MTN') ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {payment.method?.replace('MOBILE_MONEY_', '') || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
