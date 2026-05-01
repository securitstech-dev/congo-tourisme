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
import { useAuthStore } from '@/store/authStore';

export default function ListingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    adults: 1,
    children: 0
  });

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

  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/explore/${id}`);
      return;
    }

    if (!bookingData.startDate) {
      alert('Veuillez sélectionner une date de début.');
      return;
    }

    setIsBooking(true);
    try {
      // Calcul du prix total
      const basePrice = listing.pricePerNight || listing.pricePerPerson || listing.priceFlatRate || 0;
      let totalAmount = basePrice;

      if (listing.pricePerNight && bookingData.startDate && bookingData.endDate) {
        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalAmount = basePrice * (diffDays || 1);
      } else if (listing.pricePerPerson) {
        totalAmount = basePrice * (bookingData.adults + bookingData.children);
      }
      
      const response = await api.post('/bookings', {
        listingId: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate || null,
        totalAmount: totalAmount,
        adults: bookingData.adults,
        children: bookingData.children
      });

      router.push(`/booking/checkout?id=${response.data.id}`);
    } catch (error) {
      console.error('Erreur rservation:', error);
      alert('Une erreur est survenue lors de la rservation.');
    } finally {
      setIsBooking(false);
    }
  };

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
          Retour à l'exploration
        </Link>
      </div>
    );
  }

  const amenities = [
    { icon: Wifi, label: 'Wi-Fi haut débit' },
    { icon: Wind, label: 'Climatisation' },
    { icon: Coffee, label: 'Petit-déjeuner inclus' },
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
              {listing.operator?.city}, {listing.operator?.region}
            </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">À propos de ce lieu</h2>
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
                 <p className="font-bold">Carte interactive bientôt disponible (Leaflet)</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-primary/10 p-8 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black text-primary">
                  {(listing.pricePerNight || listing.pricePerPerson || listing.priceFlatRate || 0).toLocaleString()} FCFA
                </p>
                <p className="text-sm text-subtext font-bold">
                  {listing.pricePerNight ? 'par nuit' : listing.pricePerPerson ? 'par personne' : 'forfait'}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-yellow-700">4.9</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-0 border border-gray-100 rounded-3xl overflow-hidden">
                <div className="p-4 border-r border-gray-100 bg-accent/10">
                   <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Arrivée</p>
                   <input 
                     type="date" 
                     className="bg-transparent font-bold text-xs w-full focus:outline-none"
                     value={bookingData.startDate}
                     onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                   />
                </div>
                <div className="p-4 bg-accent/10">
                   <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Départ</p>
                   <input 
                     type="date" 
                     className="bg-transparent font-bold text-xs w-full focus:outline-none"
                     value={bookingData.endDate}
                     onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                   />
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-3xl bg-accent/10 flex items-center justify-between">
                 <div>
                   <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Voyageurs</p>
                   <p className="font-bold text-sm">{bookingData.adults} Adulte{bookingData.adults > 1 ? 's' : ''}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setBookingData({...bookingData, adults: Math.max(1, bookingData.adults - 1)})}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold shadow-sm"
                    >-</button>
                    <button 
                      onClick={() => setBookingData({...bookingData, adults: bookingData.adults + 1})}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold shadow-sm"
                    >+</button>
                 </div>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={isBooking}
              className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isBooking ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  Réserver maintenant
                  <ChevronRight className="w-6 h-6" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-subtext font-medium italic">
              Vous ne serez pas encore débité
            </p>

            <div className="pt-6 border-t border-gray-50 flex items-center gap-4">
               <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                 <CheckCircle2 className="w-6 h-6" />
               </div>
               <p className="text-xs text-subtext font-bold leading-relaxed">
                 Cette offre est vérifiée par Securits Tech pour garantir votre sécurité.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
