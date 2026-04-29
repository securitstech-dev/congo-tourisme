'use client';

import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  Briefcase,
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  Building2,
  Plus
} from 'lucide-react';
import { useState } from 'react';

export default function SuperAdminDashboard() {
  const stats = [
    { label: 'Revenus Mensuels', value: '2.4M FCFA', change: '+12%', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Opérateurs Actifs', value: '142', change: '+5', icon: Building2, color: 'bg-primary' },
    { label: 'Dossiers en attente', value: '12', change: '-2', icon: ShieldCheck, color: 'bg-orange-500' },
    { label: 'Agents Commerciaux', value: '8', change: 'Stable', icon: Briefcase, color: 'bg-blue-500' },
  ];

  const pendingOperators = [
    { id: 1, name: 'Lodge de la Lukaya', type: 'Hôtel', location: 'Kinshasa', date: '28 Avr 2024' },
    { id: 2, name: 'Le Terminalia', type: 'Restaurant', location: 'Pointe-Noire', date: '29 Avr 2024' },
    { id: 3, name: 'Congo Tours Agency', type: 'Agence', location: 'Brazzaville', date: '29 Avr 2024' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-foreground">Console Admin <span className="text-primary">Securits Tech</span></h1>
          <p className="text-subtext mt-2 font-medium">Vue d'ensemble de la plateforme Congo Tourisme.</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
          <div className="px-4 py-2 bg-accent/20 rounded-xl text-xs font-bold text-subtext">ADMIN UNIQUE</div>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">ST</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-black/5`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-subtext font-bold text-sm uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 
                stat.change === 'Stable' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Section - Validations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Validations de Dossiers</h2>
            <button className="text-primary font-bold text-sm hover:underline">Voir tout →</button>
          </div>
          
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-accent/5 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-bold text-subtext uppercase tracking-widest">Établissement</th>
                  <th className="px-8 py-5 text-xs font-bold text-subtext uppercase tracking-widest">Type / Lieu</th>
                  <th className="px-8 py-5 text-xs font-bold text-subtext uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingOperators.map((op) => (
                  <tr key={op.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-bold text-foreground">{op.name}</p>
                        <p className="text-xs text-subtext">Soumis le {op.date}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-accent/20 rounded-full text-[10px] font-bold text-subtext">{op.type}</span>
                        <span className="text-sm font-medium text-subtext">{op.location}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-3">
                        <button className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity">
                          <Check className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar - Commercial Team */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Équipe Commerciale</h2>
            <button className="bg-primary text-white p-2 rounded-xl">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 space-y-6">
            {[
              { name: 'Jean Makosso', deals: 12, target: '80%', color: 'bg-primary' },
              { name: 'Sarah Bantsimba', deals: 8, target: '65%', color: 'bg-secondary' },
              { name: 'Kevin Mouko', deals: 15, target: '95%', color: 'bg-green-500' },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${agent.color} rounded-2xl flex items-center justify-center text-white font-bold`}>
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{agent.name}</p>
                    <p className="text-xs text-subtext">{agent.deals} nouveaux opérateurs ce mois</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-foreground">{agent.target}</p>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className={`${agent.color} h-full`} style={{ width: agent.target }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
