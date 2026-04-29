'use client';

import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const kpis = [
    { label: 'Utilisateurs Totaux', value: '12,450', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Revenu Mensuel', value: '4.8M FCFA', change: '+8%', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Opérateurs Actifs', value: '156', change: '+5%', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Taux de Rétention', value: '94%', change: '+2%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const pendingOperators = [
    { id: '1', name: 'Grand Hôtel de Brazza', manager: 'Sylvain Ngoma', date: 'Il y a 2h', type: 'HÔTEL' },
    { id: '2', name: 'Le Mayombe Expériences', manager: 'Alice Mviri', date: 'Il y a 5h', type: 'AGENCE' },
    { id: '3', name: 'Mami Wata Coast', manager: 'Paul Kimpolo', date: 'Hier', type: 'RESTAURANT' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Tableau de bord Global</h1>
          <p className="text-gray-500 font-medium">Vue d'ensemble de la plateforme Congo Tourisme.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
           <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm">Aujourd'hui</button>
           <button className="px-4 py-2 text-gray-400 font-bold text-sm">7 derniers jours</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                {kpi.change}
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-3xl font-black text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Validations en attente */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-xl">Validations en attente</h3>
            <button className="text-primary font-bold text-sm hover:underline">Tout voir</button>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingOperators.map((op) => (
              <div key={op.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-black">
                    {op.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 group-hover:text-primary transition-colors">{op.name}</h4>
                    <p className="text-sm text-gray-400 font-medium">{op.manager} • <span className="text-primary/60">{op.type}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-bold mr-4">
                    <Clock className="w-3.5 h-3.5" />
                    {op.date}
                  </div>
                  <button className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed / Alerts */}
        <div className="bg-[#1A1A1A] p-8 rounded-[40px] text-white shadow-2xl space-y-8">
           <h3 className="font-black text-xl">Alertes Système</h3>
           <div className="space-y-6">
              {[
                { title: 'Revenus records', text: 'La barre des 4M FCFA a été dépassée ce mois-ci.', icon: TrendingUp, color: 'text-green-400' },
                { title: 'Pic de trafic', text: '500 nouveaux utilisateurs inscrits aujourd\'hui.', icon: Users, color: 'text-blue-400' },
                { title: 'Maintenance', text: 'Mise à jour du serveur prévue à 02:00.', icon: Clock, color: 'text-orange-400' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`mt-1 ${alert.color}`}>
                    <alert.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{alert.title}</h5>
                    <p className="text-xs text-white/40 font-medium leading-relaxed">{alert.text}</p>
                  </div>
                </div>
              ))}
           </div>
           <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all">
             Accéder aux logs complets
           </button>
        </div>
      </div>
    </div>
  );
}
