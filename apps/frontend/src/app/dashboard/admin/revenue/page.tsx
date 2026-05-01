'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  DollarSign,
  Activity,
  Calendar
} from 'lucide-react';

export default function AdminRevenue() {
  const stats = [
    { label: 'Revenu Total (Mois)', value: '4,850,000 FCFA', change: '+15.2%', isPositive: true, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Commissions', value: '1,250,000 FCFA', change: '+8.4%', isPositive: true, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Abonnements', value: '3,600,000 FCFA', change: '+22.1%', isPositive: true, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Remboursements', value: '120,000 FCFA', change: '-2.4%', isPositive: false, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const recentTransactions = [
    { id: 'TRX-1029', operator: 'Grand Hôtel de Brazza', type: 'Commission (Réservation)', amount: '15,000 FCFA', status: 'COMPLETED', date: 'Aujourd\'hui, 14:30' },
    { id: 'TRX-1028', operator: 'Kongo Tours', type: 'Abonnement PREMIUM', amount: '50,000 FCFA', status: 'COMPLETED', date: 'Aujourd\'hui, 10:15' },
    { id: 'TRX-1027', operator: 'Restaurant La Mandarine', type: 'Commission (Réservation)', amount: '2,500 FCFA', status: 'COMPLETED', date: 'Hier, 19:45' },
    { id: 'TRX-1026', operator: 'Mami Wata Coast', type: 'Abonnement STARTER', amount: '25,000 FCFA', status: 'PENDING', date: 'Hier, 08:20' },
  ];

  const subscriptions = [
    { plan: 'STARTER', price: '25,000 FCFA/mois', count: 85, revenue: '2,125,000 FCFA', color: 'bg-gray-100 text-gray-700' },
    { plan: 'PROFESSIONAL', price: '35,000 FCFA/mois', count: 42, revenue: '1,470,000 FCFA', color: 'bg-blue-100 text-blue-700' },
    { plan: 'PREMIUM', price: '50,000 FCFA/mois', count: 24, revenue: '1,200,000 FCFA', color: 'bg-yellow-100 text-yellow-700' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black text-gray-900">Revenus & Abonnements</h1>
          </div>
          <p className="text-gray-500 font-medium">Suivi financier des commissions et des abonnements opérateurs.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200">
             <Calendar className="w-5 h-5 text-gray-400 ml-2" />
             <select className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer">
               <option>Mai 2026</option>
               <option>Avril 2026</option>
               <option>Mars 2026</option>
             </select>
           </div>
           <button className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all flex items-center gap-2 font-bold shadow-lg">
             <Download className="w-5 h-5" />
             Exporter
           </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 font-bold text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transactions Rcentes */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-xl">Transactions Récentes</h3>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400 font-black">
                  <th className="px-8 py-4">ID / Opérateur</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Montant</th>
                  <th className="px-8 py-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <p className="font-bold text-gray-900">{trx.operator}</p>
                      <p className="text-xs text-gray-400 font-medium">{trx.id} • {trx.date}</p>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-gray-600">{trx.type}</td>
                    <td className="px-8 py-4 font-black text-gray-900">{trx.amount}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        trx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {trx.status === 'COMPLETED' ? 'Terminé' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rpartition Abonnements */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col">
          <h3 className="font-black text-gray-900 text-xl mb-6">Répartition Abonnements</h3>
          <div className="flex-1 flex flex-col gap-4">
            {subscriptions.map((sub, i) => (
              <div key={i} className="p-6 rounded-3xl border border-gray-100 hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${sub.color}`}>
                    {sub.plan}
                  </span>
                  <span className="font-bold text-gray-900 text-xl">{sub.count}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">Tarif</p>
                    <p className="text-sm font-medium text-gray-600">{sub.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold mb-1">Revenu (Est.)</p>
                    <p className="text-sm font-black text-primary">{sub.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-4 bg-primary/10 text-primary rounded-2xl font-bold hover:bg-primary hover:text-white transition-all">
            Gérer les grilles tarifaires
          </button>
        </div>
      </div>
    </div>
  );
}
