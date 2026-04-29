'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Calendar, Users, ArrowRight, 
  Compass, Star, Palmtree, Utensils, Hotel, 
  ChevronRight, Play
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function StitchHomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] selection:bg-[#1A6B4A] selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. NAVBAR - STITCH DESIGN (Glassmorphism) */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 ${scrolled ? 'bg-[#1A6B4A] text-white' : 'bg-white/20 backdrop-blur-md text-white border border-white/30'}`}>
              <Compass className="w-6 h-6" />
            </div>
            <span className={`text-2xl font-black tracking-tight transition-colors duration-500 ${scrolled ? 'text-[#1A1A1A]' : 'text-white drop-shadow-md'}`}>
              Kongo<span className={scrolled ? 'text-[#1A6B4A]' : 'text-white'}>.</span>
            </span>
          </div>

          <div className={`hidden lg:flex items-center gap-10 font-bold text-sm tracking-wide transition-colors duration-500 ${scrolled ? 'text-[#5F5E5A]' : 'text-white/90 drop-shadow-md'}`}>
            <Link href="/explore" className="hover:text-[#1A6B4A] transition-colors">Destinations</Link>
            <Link href="/explore" className="hover:text-[#1A6B4A] transition-colors">Expériences</Link>
            <Link href="/explore" className="hover:text-[#1A6B4A] transition-colors">Hébergements</Link>
          </div>

          <div className="flex items-center gap-4">
            {!mounted ? (
               <div className="w-20 h-10 bg-white/20 animate-pulse rounded-full"></div>
            ) : isAuthenticated ? (
               <div className="flex items-center gap-4">
                 <span className={`font-bold text-sm transition-colors duration-500 ${scrolled ? 'text-[#1A1A1A]' : 'text-white'}`}>
                   Salut, {user?.firstName}
                 </span>
                 <button 
                   onClick={logout} 
                   className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-xl ${scrolled ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-red-500/80 text-white hover:bg-red-500'}`}
                 >
                   Déconnexion
                 </button>
               </div>
            ) : (
              <>
                <Link href="/auth/login" className={`font-bold text-sm transition-colors duration-500 ${scrolled ? 'text-[#1A1A1A] hover:text-[#1A6B4A]' : 'text-white hover:text-white/80 drop-shadow-md'}`}>
                  Connexion
                </Link>
                <Link href="/auth/register" className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-xl ${scrolled ? 'bg-[#1A1A1A] text-white hover:bg-[#1A6B4A] hover:shadow-[#1A6B4A]/20' : 'bg-white text-[#1A1A1A] hover:bg-white/90 hover:scale-105'}`}>
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION - IMMERSIVE CINEMATIC */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-[#1A6B4A]">
        {/* Background Image with Parallax effect simulation */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=2000" 
            alt="Congo Forest" 
            className="w-full h-full object-cover scale-105 animate-[slow-zoom_20s_ease-in-out_infinite] opacity-80"
          />
          {/* Vibrant Gradients for text readability and less "sad" look */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A6B4A]/60 via-black/20 to-[#FAFAF8]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto -mt-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-black uppercase tracking-widest mb-8 shadow-xl">
            <Star className="w-4 h-4 text-[#C8860A] fill-[#C8860A]" />
            La 1ère plateforme touristique du Congo
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black text-white leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl">
            L'Afrique <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8860A] to-[#FCD34D] italic pr-4">Sauvage.</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-white font-semibold max-w-3xl mx-auto leading-relaxed mb-12 drop-shadow-lg">
            Hôtels de luxe, restaurants gastronomiques, casinos, vie nocturne et safaris. Vivez l'expérience totale du Congo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-10 py-5 bg-[#C8860A] text-white rounded-full font-black text-xl flex items-center justify-center gap-3 hover:scale-105 hover:bg-[#b07505] transition-all shadow-2xl shadow-[#C8860A]/50">
              Explorer les offres
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-full font-black text-xl flex items-center justify-center gap-3 hover:bg-white/30 transition-all shadow-2xl">
              <Play className="w-6 h-6 fill-white" />
              Voir la vidéo
            </button>
          </div>
        </div>
      </section>

      {/* SEARCH BAR - Moved BELOW the Hero */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 -mt-16 mb-20">
        <div className="bg-white p-3 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center px-6 py-5 bg-gray-50 hover:bg-accent/30 transition-colors rounded-[2rem] cursor-pointer">
            <Compass className="text-[#1A6B4A] w-7 h-7 mr-4" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Expérience</p>
              <p className="font-bold text-lg text-[#1A1A1A]">Que faire ?</p>
            </div>
          </div>
          <div className="flex-1 flex items-center px-6 py-5 bg-gray-50 hover:bg-accent/30 transition-colors rounded-[2rem] cursor-pointer">
            <MapPin className="text-[#1A6B4A] w-7 h-7 mr-4" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Destination</p>
              <p className="font-bold text-lg text-[#1A1A1A]">Où aller ?</p>
            </div>
          </div>
          <div className="flex-1 flex items-center px-6 py-5 bg-gray-50 hover:bg-accent/30 transition-colors rounded-[2rem] cursor-pointer">
            <Calendar className="text-[#1A6B4A] w-7 h-7 mr-4" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Dates</p>
              <p className="font-bold text-lg text-[#1A1A1A]">Quand ?</p>
            </div>
          </div>
          <button className="bg-[#1A6B4A] text-white px-10 py-5 rounded-[2rem] flex items-center justify-center hover:bg-[#114b33] transition-colors shadow-lg font-black text-lg gap-3">
            <Search className="w-6 h-6" />
            Chercher
          </button>
        </div>
      </div>

      {/* 3. CATEGORIES - LUXURY CARDS WITH GORILLA DECORATION */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Background Decorative Gorilla */}
        <img 
          src="https://cdn.pixabay.com/photo/2014/04/03/10/41/gorilla-311146_1280.png" 
          alt="Gorilla Decor" 
          className="absolute -top-10 -right-20 w-96 opacity-10 pointer-events-none -scale-x-100"
        />

        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-[#1A6B4A]">L'excellence congolaise.</h2>
            <p className="text-xl text-[#5F5E5A] font-medium">Découvrez une sélection rigoureuse d'établissements et d'activités pour un séjour inoubliable.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Hôtels & Lodges', desc: 'Le luxe au cœur de la nature.', icon: Hotel, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' },
            { title: 'Gastronomie', desc: 'Restaurants et saveurs locales d\'exception.', icon: Utensils, img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800' },
            { title: 'Vie Nocturne', desc: 'Bars VIP, lounges et clubs prestigieux.', icon: Star, img: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800' },
            { title: 'Casinos & Loisirs', desc: 'Salles de jeux, parcs et détente.', icon: Compass, img: 'https://images.unsplash.com/photo-1605663701460-2621b4aeb1b6?auto=format&fit=crop&q=80&w=800' },
          ].map((cat, i) => (
            <div key={i} className="group relative h-[400px] rounded-[2.5rem] overflow-hidden cursor-pointer">
              <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-[#1A6B4A] transition-colors duration-500">
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{cat.title}</h3>
                <p className="text-white/80 font-medium mb-6 text-sm">{cat.desc}</p>
                <div className="flex items-center gap-2 text-white font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 text-sm">
                  Explorer <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED DESTINATIONS - BENTO GRID */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 -left-32 w-96 h-96 bg-[#C8860A]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-40 -right-32 w-96 h-96 bg-[#1A6B4A]/10 rounded-full blur-3xl pointer-events-none"></div>
        <img 
          src="https://cdn.pixabay.com/photo/2013/07/13/11/44/gorilla-158564_1280.png" 
          alt="Gorilla Silhouette" 
          className="absolute bottom-10 left-10 w-64 opacity-[0.03] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#1A6B4A] font-black uppercase tracking-widest text-sm mb-4 block">Destinations Phares</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight">Où le voyage commence.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[400px_400px] gap-6">
            <div className="md:col-span-2 md:row-span-2 relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-xl">
              <img src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=1200" alt="Pointe-Noire" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <h3 className="text-5xl font-black text-white mb-2">Pointe-Noire</h3>
                <p className="text-xl text-white/90 font-medium">La capitale économique et ses plages.</p>
              </div>
              <div className="absolute top-10 right-10 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold border border-white/20 shadow-lg">
                120+ Offres
              </div>
            </div>
            
            <div className="md:col-span-2 relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-xl">
              <img src="https://images.unsplash.com/photo-1547471080-7fc2caa7bab4?auto=format&fit=crop&q=80&w=800" alt="Brazzaville" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl font-black text-white mb-1">Brazzaville</h3>
                <p className="text-white/90 font-medium text-lg">L'élégance sur le fleuve.</p>
              </div>
            </div>

            <div className="relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-xl">
              <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=600" alt="Parc National d'Odzala" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-black text-white mb-1">Odzala</h3>
                <p className="text-white/90 font-medium">Les Gorilles.</p>
              </div>
            </div>

            <div className="relative rounded-[3rem] overflow-hidden group cursor-pointer bg-gradient-to-br from-[#1A6B4A] to-[#0d3b28] p-8 flex flex-col justify-between shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-white -rotate-45" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white mb-2">Voir tout</h3>
                <p className="text-white/80 font-medium">Découvrez toutes nos destinations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION - MINIMALIST */}
      <section className="py-32 bg-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Prêt pour l'aventure ?</h2>
          <p className="text-xl text-white/60 mb-12">Rejoignez des milliers de voyageurs et découvrez les secrets les mieux gardés du Congo.</p>
          <button className="px-10 py-6 bg-white text-[#1A1A1A] rounded-full font-black text-xl hover:scale-105 transition-transform shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]">
            Créer un compte gratuitement
          </button>
        </div>
      </section>

    </div>
  );
}
