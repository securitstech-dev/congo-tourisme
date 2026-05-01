'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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
  Music,
  MapPinned
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-50 rounded-[32px] border border-gray-100"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
});

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('type') || '';
  const { isAuthenticated: isAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = mounted ? isAuth : false;

  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const query = categoryParam ? `?type=${categoryParam}` : '';
        const response = await api.get(`/listings${query}`);
        if (response.data && response.data.length > 0) {
          setListings(response.data);
        } else {
          throw new Error("Empty data, fallback to mock");
        }
      } catch (error) {
        console.log('Utilisation de données fictives pour la démo');
        const mockListings = [
          {
            id: '1',
            title: 'Hôtel Atlantic Palace',
            type: 'Hébergement',
            location: 'Centre-ville, Pointe-Noire',
            price: 75000,
            images: [{ url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600' }]
          },
          {
            id: '2',
            title: 'VIP Lounge Club',
            type: 'NIGHTCLUB',
            location: 'Côte Sauvage, Pointe-Noire',
            price: 15000,
            images: [{ url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=600' }]
          },
          {
            id: '3',
            title: 'Excursion Gorges de Diosso',
            type: 'LEISURE_ACTIVITY',
            location: 'Diosso, Kouilou',
            price: 25000,
            images: [{ url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=600' }]
          }
        ];
        
        if (categoryParam) {
          setListings(mockListings.filter(l => l.type === categoryParam));
        } else {
          setListings(mockListings);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [categoryParam]);

  const categories = [
    { icon: MapIcon, label: 'Tout', type: '' },
    { icon: Hotel, label: 'Hébergements', type: 'HOTEL' },
    { icon: Utensils, label: 'Restaurants', type: 'RESTAURANT' },
    { icon: Music, label: 'Boîtes de Nuit', type: 'NIGHTCLUB' },
    { icon: Star, label: 'Sites & Loisirs', type: 'SITE' },
  ];

  return (
    <div className="min-h-screen bg-accent/10">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
            <input 
              type="text" 
              placeholder="Où voulez-vous aller ?" 
              className="w-full pl-12 pr-4 py-3 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-sm hover:bg-accent/30 transition-all flex-1 md:flex-none"
            >
              <MapPinned className="w-4 h-4 text-primary" />
              {viewMode === 'grid' ? 'Carte' : 'Grille'}
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-sm hover:bg-accent/30 transition-all flex-1 md:flex-none"
            >
              <Filter className="w-4 h-4 text-primary" />
              Filtres
            </button>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="max-w-7xl mx-auto px-6 pb-4 flex items-center gap-8 overflow-x-auto no-scrollbar">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => router.push(cat.type ? `/explore?type=${cat.type}` : '/explore')}
              className={`flex flex-col items-center gap-2 pb-2 border-b-2 transition-all min-w-fit group
                ${categoryParam === cat.type ? 'border-primary' : 'border-transparent hover:border-primary'}
              `}
            >
              <cat.icon className={`w-5 h-5 transition-all group-hover:scale-110 
                ${categoryParam === cat.type ? 'text-primary' : 'text-subtext group-hover:text-primary'}
              `} />
              <span className={`text-xs font-bold 
                ${categoryParam === cat.type ? 'text-primary' : 'text-subtext group-hover:text-primary'}
              `}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters (Desktop) */}
        {showFilters && (
          <aside className="lg:block space-y-8 col-span-1">
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
                        <span className="text-sm font-medium text-subtext group-hover:text-primary">{star}+ étoiles</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Listings Content */}
        <div className={`transition-all duration-300 ${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-subtext font-bold text-lg">Recherche en cours...</p>
            </div>
          ) : viewMode === 'map' ? (
            <div className="h-[600px] w-full">
              <MapView listings={listings} />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-40">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/20">
                <MapIcon className="text-primary w-12 h-12 opacity-20" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Aucune offre trouvée</h2>
              <p className="text-subtext">Essayez d'ajuster vos filtres ou explorez d'autres catégories.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${showFilters ? 'xl:grid-cols-2' : 'xl:grid-cols-3'} gap-8`}>
              {listings.map((item) => (
                <div key={item.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                  <div className="relative h-64 overflow-hidden shrink-0">
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

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center text-subtext text-xs font-bold uppercase tracking-widest mb-3">
                      <MapPin className="w-4 h-4 mr-1 text-primary shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    
                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                      {isAuthenticated ? (
                        <>
                          <div>
                            <p className="text-xs text-subtext font-bold uppercase tracking-tighter">À partir de</p>
                            <p className="text-xl lg:text-2xl font-black text-primary">{item.price?.toLocaleString()} <span className="text-xs font-bold">FCFA</span></p>
                          </div>
                          <Link 
                            href={`/explore/${item.id}`}
                            className="bg-accent text-primary px-6 py-3 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                          >
                            Réserver
                          </Link>
                        </>
                      ) : (
                        <div className="w-full flex justify-between items-center bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                               <span className="text-orange-600 font-bold">🔒</span>
                             </div>
                             <p className="text-sm font-bold text-orange-800">Prix masqué</p>
                           </div>
                           <Link href="/auth/login" className="text-sm font-bold text-primary hover:underline">
                             Se connecter pour voir
                           </Link>
                        </div>
                      )}
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

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
