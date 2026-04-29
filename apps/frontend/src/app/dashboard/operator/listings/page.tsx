'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Hotel,
  MapPin,
  Star,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function OperatorListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get('/listings/my-listings');
        setListings(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes Annonces</h1>
          <p className="text-subtext">Gérez vos offres et leur visibilité sur la plateforme.</p>
        </div>
        <Link href="/dashboard/operator/listings/new" className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          Ajouter une annonce
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
          <input 
            type="text" 
            placeholder="Rechercher une annonce..." 
            className="w-full pl-12 pr-4 py-3 bg-accent/20 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          />
        </div>
        <select className="w-full md:w-48 py-3 px-4 bg-accent/20 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium cursor-pointer">
          <option>Tous les types</option>
          <option>Hôtels</option>
          <option>Restaurants</option>
          <option>Sites</option>
        </select>
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-subtext font-bold">Chargement de vos annonces...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Hotel className="text-primary w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Aucune annonce pour le moment</h2>
          <p className="text-subtext mb-8">Commencez par ajouter votre premier établissement sur Congo Tourisme.</p>
          <Link href="/dashboard/operator/listings/new" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
            Créer ma première annonce
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-accent/20 flex items-center justify-center">
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0].url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <Hotel className="w-12 h-12 text-primary/20" />
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-green-500 text-white`}>
                    Actif
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.type}</span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                <div className="flex items-center text-subtext text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-subtext font-medium">Prix</p>
                    <p className="text-lg font-bold text-primary">{item.price.toLocaleString()} FCFA</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6">
                  <button className="flex items-center justify-center gap-2 py-2 bg-accent/30 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all">
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2 bg-accent/30 text-secondary rounded-xl font-bold text-sm hover:bg-secondary hover:text-white transition-all">
                    <Edit2 className="w-4 h-4" />
                    Éditer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
