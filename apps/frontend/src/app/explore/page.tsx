'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Hotel, 
  Utensils, 
  Map as MapIcon, 
  ChevronDown,
  Loader2,
  X
} from 'lucide-react';
import api from '@/lib/api';

export default function ExplorePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get('/listings');
        setListings(response.data);
      } catch (error) {
        console.error('Erreur lors de la rcupration des annonces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  const categories = [
    { icon: Hotel, label: 'Hbergements' },
    { icon: Utensils, label: 'Restaurants' },
    { icon: MapIcon, label: 'Expriences' },
  ];

  return (
    <div className="min-h-screen bg-accent/10">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
            <input 
              type="text" 
              placeholder="O voulez-vous aller ?" 
              className="w-full pl-12 pr-4 py-3 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-sm hover:bg-accent/30 transition-all flex-1 md:flex-none"
            >
              <Filter className="w-4 h-4 text-primary" />
              Filtres
            </button>
            <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex-1 md:flex-none">
              Rechercher
            </button>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="max-w-7xl mx-auto px-6 pb-4 flex items-center gap-8 overflow-x-auto no-scrollbar">
          {categories.map((cat, i) => (
            <button key={i} className="flex flex-col items-center gap-2 pb-2 border-b-2 border-transparent hover:border-primary group transition-all min-w-fit">
              <cat.icon className="w-5 h-5 text-subtext group-hover:text-primary group-hover:scale-110 transition-all" />
              <span className="text-xs font-bold text-subtext group-hover:text-primary">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center justify-between">
                Fourchette de prix
                <ChevronDown className="w-4 h-4 text-subtext" />
              </h3>
              <div className="space-y-4">
                <input type="range" className="w-full accent-primary" />
                <div className="flex justify-between text-xs font-bold text-subtext">
                  <span>0 FCFA</span>
                  <span>500.000 FCFA+</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <h3 className="font-bold text-foreground mb-4">Note minimale</h3>
              <div className="space-y-2">
                {[4, 3, 2].map((star) => (
                  <label key={star} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary" />
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-subtext group-hover:text-primary">{star}+ etoiles</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-subtext font-bold text-lg">Exploration du Congo en cours...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-40">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/20">
                <MapIcon className="text-primary w-12 h-12 opacity-20" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Aucune offre trouve</h2>
              <p className="text-subtext">Essayez d'ajuster vos filtres ou revenez plus tard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {listings.map((item) => (
                <div key={item.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                       <span className="bg-white/90 backdrop-blur-md text-primary px-4 py-2 rounded-2xl text-xs font-bold shadow-xl uppercase tracking-tighter">
                         {item.type}
                       </span>
                    </div>
                    <button className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white hover:bg-white/40 transition-all">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center text-subtext text-xs font-bold uppercase tracking-widest mb-3">
                      <MapPin className="w-4 h-4 mr-1 text-primary" />
                      {item.location}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div>
                        <p className="text-xs text-subtext font-bold uppercase tracking-tighter"> partir de</p>
                        <p className="text-2xl font-black text-primary">{item.price.toLocaleString()} <span className="text-xs font-bold">FCFA</span></p>
                      </div>
                      <button className="bg-accent text-primary px-6 py-3 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
                        Dcouvrir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
