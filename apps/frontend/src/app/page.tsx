'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Star,
  CheckCircle2,
  Play,
  Loader2,
  Tag,
  Bot,
  CreditCard,
  Leaf,
  Sparkles,
  Map,
  Train,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Placeholders pour les futures images (Prompts à fournir à l'utilisateur)
  const heroImages = [
    '/hero-odzala-placeholder.png', // Prompt 1
    '/hero-pointe-noire-placeholder.png', // Prompt 2
    '/hero-brazzaville-placeholder.png', // Prompt 3
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/listings');
        if (res.data) {
          setListings(res.data.slice(0, 4));
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error('Erreur API:', error);
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="bg-background overflow-hidden selection:bg-primary/30 selection:text-primary-dark">
      {/* 1. HERO SECTION (Ultra-immersif) */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentBgIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              src={heroImages[currentBgIndex]} 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              alt="Découvrez le Congo"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background z-10" />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-white">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              <span className="text-sm font-bold tracking-widest uppercase">La 1ère Marketplace 100% Congolaise</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl md:text-8xl font-black leading-[1.05] tracking-tighter">
              Vivez l'Exceptionnel au <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Congo</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl sm:text-2xl text-gray-200 font-medium max-w-2xl leading-relaxed">
              Hôtels de luxe, réserves naturelles protégées, gastronomie locale et événements. Réservez tout votre séjour en un clic avec MTN et Airtel Money.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 pt-8">
              <Link href="/explore" className="group relative overflow-hidden bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(26,107,74,0.4)] hover:shadow-[0_0_60px_rgba(26,107,74,0.6)] transition-all flex items-center justify-center gap-3">
                <span className="relative z-10 flex items-center gap-2">Explorer les offres <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Link>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                <Play className="w-5 h-5 fill-white" />
                Voir la vidéo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS & CONFIANCE (Flottant sous le hero) */}
      <div className="relative z-30 -mt-24 mb-32 hidden lg:block">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl p-10 flex justify-between items-center border border-white/40"
          >
            {[
              { num: "500+", text: "Établissements Vérifiés", color: "text-primary" },
              { num: "24/7", text: "Kongo AI Assistant", color: "text-secondary" },
              { num: "100%", text: "Paiements Sécurisés", color: "text-primary" },
              { num: "12", text: "Régions Couvertes", color: "text-secondary" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className={`text-5xl font-black ${stat.color}`}>{stat.num}</div>
                <div className="text-sm font-bold text-gray-500 leading-tight" dangerouslySetInnerHTML={{ __html: stat.text.replace(' ', '<br/>') }} />
                {i < 3 && <div className="w-px h-16 bg-gray-200 ml-8" />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 3. FONCTIONNALITÉS INNOVANTES (Ce que fait l'app) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
              <Sparkles className="w-4 h-4" /> Innovation Congolaise
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Bien plus qu'une simple agence de voyage.</h2>
            <p className="text-xl text-subtext">Congo Tourisme centralise tout ce dont vous avez besoin pour vivre la meilleure expérience possible sur le territoire national.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Kongo AI */}
            <motion.div whileHover={{ y: -10 }} className="bg-accent/20 p-10 rounded-[40px] border border-accent/50 space-y-6">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black">Rencontrez "Kongo"</h3>
              <p className="text-subtext leading-relaxed">Notre intelligence artificielle intégrée connait tous les secrets du pays. Posez-lui des questions sur les visas, la météo, ou les meilleurs restaurants locaux en temps réel.</p>
            </motion.div>

            {/* Feature 2: Paiement Local */}
            <motion.div whileHover={{ y: -10 }} className="bg-secondary/10 p-10 rounded-[40px] border border-secondary/30 space-y-6">
              <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black">Paiement Universel</h3>
              <p className="text-subtext leading-relaxed">Payez vos réservations depuis l'étranger par carte bancaire (Stripe) ou localement via <strong>MTN Mobile Money</strong> et <strong>Airtel Money</strong>. Simple et instantané.</p>
            </motion.div>

            {/* Feature 3: Logistique & Écologie */}
            <motion.div whileHover={{ y: -10 }} className="bg-green-50 p-10 rounded-[40px] border border-green-100 space-y-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/30">
                  <Leaf className="w-8 h-8" />
                </div>
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Train className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-black">Logistique & Éthique</h3>
              <p className="text-subtext leading-relaxed">Consultez les horaires du train CFCO, l'état de la Nationale 1, et filtrez les opérateurs possédant notre badge <strong>Tourisme Durable</strong>.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. OFFRES POPULAIRES (Le catalogue) */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Expériences <span className="text-primary">Récentes</span></h2>
              <p className="text-xl text-subtext max-w-xl">Plongez dans le catalogue des meilleurs établissements et activités du pays.</p>
            </div>
            <Link href="/explore" className="text-primary font-bold flex items-center gap-2 hover:underline text-lg">
              Tout voir <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
            ) : listings.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-subtext font-bold text-xl mb-4">Aucune offre disponible pour le moment.</p>
                <p className="text-sm text-gray-500 bg-gray-100 p-4 rounded-xl inline-block">🛠️ <b>Astuce Admin :</b> Lancez <code className="bg-white px-2 py-1 rounded">npm run seed --workspace=packages/database</code> pour générer les 3 opérateurs fictifs.</p>
              </div>
            ) : (
              listings.map((listing, i) => (
                <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  {/* Card design kept similar but modernized */}
                  <Link href={`/explore/${listing.id}`} className="group h-full flex flex-col bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden shrink-0">
                      <img src={listing.images?.[0]?.url || '/welcome.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={listing.title} />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                        <span className="text-xs font-bold text-foreground">4.9</span>
                      </div>
                    </div>
                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 w-fit px-3 py-1.5 rounded-lg">
                        <Tag className="w-3 h-3" /> {listing.listingType}
                      </div>
                      <h4 className="font-bold text-xl leading-snug group-hover:text-primary transition-colors line-clamp-2">{listing.title}</h4>
                      <div className="flex items-center text-subtext text-sm mt-auto">
                        <MapPin className="w-4 h-4 mr-1 text-primary shrink-0" />
                        <span className="truncate font-medium">{listing.operator?.city || "Congo"}</span>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-2xl font-black text-foreground">
                          {(listing.pricePerNight || listing.pricePerPerson || listing.priceFlatRate || 0).toLocaleString()} <span className="text-sm text-subtext font-bold">FCFA</span>
                        </p>
                        <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. OPÉRATEURS & PRICING (Explication B2B) */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Propulsez votre établissement.</h2>
            <p className="text-xl text-gray-400">Passez au digital. Acceptez les réservations 24/7, gagnez en visibilité internationale et gagnez la confiance des touristes avec un tableau de bord professionnel.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* STARTER */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 hover:bg-white/10 transition-colors">
              <h3 className="text-2xl font-black text-gray-300">STARTER</h3>
              <p className="text-4xl font-black mt-4 mb-2">15.000 <span className="text-lg text-gray-500 font-medium">FCFA / mois</span></p>
              <p className="text-sm text-gray-400 mb-8">Pour les petites structures et indépendants.</p>
              <ul className="space-y-4 mb-10">
                {['Jusqu\'à 5 annonces', 'Réservations basiques', 'Support par email', 'Paiement Mobile Money'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-secondary" /> {feature}</li>
                ))}
              </ul>
            </div>

            {/* PROFESSIONAL (Highlighted) */}
            <div className="bg-gradient-to-b from-primary/80 to-primary/40 border border-primary rounded-[40px] p-10 relative transform md:-translate-y-4 shadow-2xl shadow-primary/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">Le plus choisi</div>
              <h3 className="text-2xl font-black text-white">PROFESSIONAL</h3>
              <p className="text-4xl font-black mt-4 mb-2 text-white">35.000 <span className="text-lg text-white/70 font-medium">FCFA / mois</span></p>
              <p className="text-sm text-white/80 mb-8">Pour les hôtels et restaurants établis.</p>
              <ul className="space-y-4 mb-10">
                {['Annonces illimitées', 'Tableau de bord Analytics', 'Support prioritaire WhatsApp', 'Badge "Établissement Vérifié"', 'Mise en avant algorithmique'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white"><Check className="w-5 h-5 text-secondary" /> {feature}</li>
                ))}
              </ul>
              <Link href="/auth/register-operator" className="block w-full py-4 bg-white text-primary text-center font-black rounded-2xl hover:scale-105 transition-transform">
                Commencer l'essai de 14 jours
              </Link>
            </div>

            {/* PREMIUM */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 hover:bg-white/10 transition-colors">
              <h3 className="text-2xl font-black text-secondary">PREMIUM</h3>
              <p className="text-4xl font-black mt-4 mb-2">75.000 <span className="text-lg text-gray-500 font-medium">FCFA / mois</span></p>
              <p className="text-sm text-gray-400 mb-8">Pour les complexes de luxe et chaînes.</p>
              <ul className="space-y-4 mb-10">
                {['Tout du pack Professionnel', 'Reportage photo inclus', 'Badge "Tourisme Durable"', 'API pour système externe', 'Gestionnaire de compte dédié'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-secondary" /> {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL (Social Proof) */}
      <section className="py-32 bg-primary relative overflow-hidden">
        {/* Placeholder for faces image - Prompt 4 */}
        <div className="absolute inset-0 opacity-20 bg-[url('/community-faces-placeholder.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 drop-shadow-lg">Le Congo n'attend que vous.</h2>
          <p className="text-2xl font-medium text-white/90 max-w-2xl mx-auto mb-12">Rejoignez des milliers de touristes et d'opérateurs qui utilisent déjà Congo Tourisme pour redécouvrir le pays.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/explore" className="bg-white text-primary px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl">
              Explorer en tant que visiteur
            </Link>
            <Link href="/auth/register-operator" className="bg-secondary text-white px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl">
              Inscrire mon activité
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

