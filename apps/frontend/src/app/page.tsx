'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { 
  ArrowRight, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Globe, 
  Star,
  CheckCircle2,
  Play,
  Loader2,
  Tag
} from 'lucide-react';

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const featuredDestinations = [
    { title: 'Pointe-Noire', sub: 'La Côte Sauvage', img: 'https://images.unsplash.com/photo-1518005020251-58296d19119d?q=80&w=800' },
    { title: 'Odzala-Kokoua', sub: 'Parc National', img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800' },
    { title: 'Brazzaville', sub: 'La Verte', img: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?q=80&w=800' },
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/listings');
        setListings(res.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Congo Landscape"
          />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-white">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-black tracking-widest uppercase">Plateforme Officielle du Tourisme Congolais</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter">
              Explorez le <span className="text-primary underline decoration-secondary decoration-4">Cœur de l'Afrique</span>
            </h1>
            
            <p className="text-xl text-gray-300 font-medium max-w-xl leading-relaxed">
              Découvrez des paysages époustouflants, une faune unique et l'hospitalité légendaire de la République du Congo. Tout est à portée de clic.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/explore" 
                className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Commencer l'aventure
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                <Play className="w-5 h-5 fill-white" />
                Découvrir en vidéo
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="absolute bottom-10 left-0 right-0 z-20 hidden lg:block">
          <div className="container mx-auto px-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-primary">500+</div>
                <div className="text-sm font-bold text-gray-400">Établissements<br/>Vérifiés</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-secondary">24/7</div>
                <div className="text-sm font-bold text-gray-400">Assistance<br/>Touristique</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-primary">100%</div>
                <div className="text-sm font-bold text-gray-400">Paiements<br/>Sécurisés</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-secondary">12</div>
                <div className="text-sm font-bold text-gray-400">Parcs & Sites<br/>Nationaux</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Destinations <span className="text-primary">Incontournables</span></h2>
            <p className="text-subtext text-lg max-w-xl">
              Des plages vierges de Pointe-Noire aux forêts mystiques du Nord, le Congo vous attend.
            </p>
          </div>
          <Link href="/explore" className="text-primary font-bold flex items-center gap-2 hover:underline">
            Voir tous les sites <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDestinations.map((dest, i) => (
            <Link key={dest.title} href="/explore" className="group relative h-[500px] overflow-hidden rounded-[40px]">
              <img 
                src={dest.img} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={dest.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-secondary font-black tracking-widest text-xs mb-2 uppercase">{dest.sub}</p>
                <h3 className="text-4xl font-black tracking-tight">{dest.title}</h3>
              </div>
              <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Listings */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Offres <span className="text-primary">Populaires</span></h2>
            <p className="text-subtext">Sélectionnées par nos experts pour votre prochain séjour au Congo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
            ) : listings.length === 0 ? (
              <div className="col-span-full py-20 text-center text-subtext font-bold text-xl">Aucune offre disponible pour le moment.</div>
            ) : (
              listings.map((listing) => (
                <Link 
                  key={listing.id} 
                  href={`/explore/${listing.id}`}
                  className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={listing.title}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-foreground">4.9</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 w-fit px-2 py-1 rounded-md">
                      <Tag className="w-3 h-3" />
                      {listing.listingType}
                    </div>
                    <h4 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">{listing.title}</h4>
                    <div className="flex items-center text-subtext text-sm">
                      <MapPin className="w-4 h-4 mr-1 text-primary" />
                      {listing.operator?.city}
                    </div>
                    <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                      <p className="text-lg font-black text-foreground">
                        {(listing.pricePerNight || listing.pricePerPerson || listing.priceFlatRate || 0).toLocaleString()} <span className="text-xs text-subtext font-bold">FCFA</span>
                      </p>
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Operators Section */}
      <section className="py-32 bg-accent/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="p-3 bg-primary/10 w-fit rounded-2xl">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-5xl font-black tracking-tighter">Vous êtes un <span className="text-primary">Opérateur Touristique ?</span></h2>
              <p className="text-xl text-subtext leading-relaxed">
                Rejoignez la révolution digitale du tourisme au Congo. Augmentez votre visibilité, gérez vos réservations et faites croître votre chiffre d'affaires.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg text-foreground">14 jours d'essai gratuit sans engagement</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg text-foreground">Paiement Mobile Money (MTN/Airtel) intégré</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg text-foreground">Tableau de bord de gestion complet</span>
                </li>
              </ul>

              <div className="flex gap-4 pt-6">
                <Link 
                  href="/auth/register" 
                  className="bg-primary text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
                >
                  Inscrire mon établissement
                </Link>
                <Link 
                  href="/pricing" 
                  className="bg-white border border-gray-200 text-foreground px-10 py-5 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  Voir les tarifs
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-[60px] blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=1000" 
                className="relative rounded-[50px] shadow-2xl border border-white/20"
                alt="Dashboard Preview"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
