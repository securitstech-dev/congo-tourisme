'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  Share2, 
  Heart, 
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Users,
  ChevronRight,
  Loader2,
  Wifi,
  Wind,
  Coffee,
  Tv
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ListingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Erreur lors de la rcupration de l\'annonce:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <p className="text-xl font-bold text-subtext">Annonce introuvable</p>
        <Link href="/explore" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold">
          Retour  l'exploration
        </Link>
      </div>
    );
  }

  const amenities = [
    { icon: Wifi, label: 'Wi-Fi haut dbit' },
    { icon: Wind, label: 'Climatisation' },
    { icon: Coffee, label: 'Petit-djuner inclus' },
    { icon: Tv, label: 'Smart TV' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/explore" className="flex items-center gap-2 text-subtext hover:text-primary font-bold transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Retour
        </Link>
        <div className="flex items-center gap-4">
          <button className="p-3 hover:bg-accent rounded-2xl transition-all">
            <Share2 className="w-5 h-5 text-subtext" />
          </button>
          <button className="p-3 hover:bg-accent rounded-2xl transition-all">
            <Heart className="w-5 h-5 text-subtext" />
          </button>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
        <div className="md:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
            className="w-full h-full object-cover"
            alt={listing.title}
          />
        </div>
        <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-4">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="relative rounded-2xl overflow-hidden shadow-lg bg-accent/20">
                <img 
                  src={`https://images.unsplash.com/photo-${1566073771259 + i}?auto=format&fit=crop&q=80&w=400`}
                  className="w-full h-full object-cover"
                  alt="Gallery"
                />
             </div>
           ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-4">
               <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                 {listing.type}
               </span>
               <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg ml-2">
                 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                 <span className="text-sm font-bold text-yellow-700">4.9</span>
               </div>
            </div>
            <h1 className="text-4xl font-black text-foreground leading-tight mb-4">{listing.title}</h1>
            <div className="flex items-center text-subtext text-lg font-medium">
              <MapPin className="w-6 h-6 mr-2 text-primary" />
              {listing.location}
            </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground"> propos de ce lieu</h2>
            <p className="text-lg text-subtext leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Ce que propose ce lieu</h2>
            <div className="grid grid-cols-2 gap-6">
              {amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-subtext">
                  <div className="w-12 h-12 bg-accent/30 rounded-2xl flex items-center justify-center text-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Location Map Placeholder */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Localisation</h2>
            <div className="h-[300px] bg-accent/20 rounded-3xl overflow-hidden relative border border-gray-100">
               <div className="absolute inset-0 flex items-center justify-center text-subtext/40 flex-col gap-4">
                 <MapPin className="w-12 h-12 opacity-20" />
                 <p className="font-bold">Carte interactive bientt disponible (Leaflet)</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-primary/10 p-8 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black text-primary">{listing.price.toLocaleString()} FCFA</p>
                <p className="text-sm text-subtext font-bold">par nuit</p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-yellow-700">4.9</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-0 border border-gray-100 rounded-3xl overflow-hidden">
                <div className="p-4 border-r border-gray-100 bg-accent/10">
                   <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Arrive</p>
                   <p className="font-bold text-sm">Ajouter date</p>
                </div>
                <div className="p-4 bg-accent/10">
                   <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Dpart</p>
                   <p className="font-bold text-sm">Ajouter date</p>
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-3xl bg-accent/10">
                 <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Voyageurs</p>
                 <p className="font-bold text-sm">1 voyageur</p>
              </div>
            </div>

            <button className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
              Réserver maintenant
              <ChevronRight className="w-6 h-6" />
            </button>

            <p className="text-center text-xs text-subtext font-medium italic">
              Vous ne serez pas encore dbit
            </p>

            <div className="pt-6 border-t border-gray-50 flex items-center gap-4">
               <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                 <CheckCircle2 className="w-6 h-6" />
               </div>
               <p className="text-xs text-subtext font-bold leading-relaxed">
                 Cette offre est vrifie par Securits Tech pour garantir votre scurit.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
