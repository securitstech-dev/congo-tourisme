'use client';

import { useState } from 'react';
import { Check, Zap, Shield, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Pack Découverte',
    monthlyPrice: 15000,
    annualPrice: 150000,
    description: 'Parfait pour les petits établissements et artisans locaux.',
    features: [
      "Jusqu'à 3 annonces actives",
      'Photos standard (max 5 par annonce)',
      'Gestion des réservations basique',
      'Support par email',
      "14 jours d'essai gratuit"
    ],
    cta: 'Essayer gratuitement',
    icon: Zap,
    popular: false,
    color: '#5F5E5A'
  },
  {
    name: 'Pack Business',
    monthlyPrice: 45000,
    annualPrice: 450000,
    description: 'Le choix idéal pour les hôtels et restaurants établis.',
    features: [
      'Annonces illimitées',
      'Photos HD illimitées',
      "Badge 'Vérifié' sur le profil",
      'Statistiques de performance',
      'Support prioritaire 24/7',
      'Mise en avant dans les recherches',
      "14 jours d'essai gratuit"
    ],
    cta: "Démarrer l'essai",
    icon: Shield,
    popular: true,
    color: '#1A6B4A'
  },
  {
    name: 'Pack Prestige',
    monthlyPrice: 120000,
    annualPrice: 1200000,
    description: 'Pour les agences et grands complexes hôteliers.',
    features: [
      'Tout du Pack Business',
      'Service de photographie pro inclus',
      'Gestionnaire de compte dédié',
      'Accès API pour synchronisation',
      "Publicité sur la page d'accueil",
      'Assistance marketing Congo Tourisme',
      "14 jours d'essai gratuit"
    ],
    cta: 'Contacter la direction',
    icon: Crown,
    popular: false,
    color: '#C8860A'
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="bg-background py-20">
      <div className="container mx-auto px-6">

        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Des prix adaptés à votre <span className="text-primary underline decoration-secondary">activité</span>
          </h1>
          <p className="text-xl text-subtext mb-10">
            Rejoignez la plus grande marketplace touristique du Congo. Profitez de{' '}
            <span className="font-bold text-primary">14 jours d&apos;essai gratuit</span> sur tous nos packs.
          </p>

          {/* Toggle Mensuel / Annuel */}
          <div className="inline-flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                !isAnnual ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-subtext hover:text-foreground'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                isAnnual ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-subtext hover:text-foreground'
              }`}
            >
              Annuel
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                isAnnual ? 'bg-white/20 text-white' : 'bg-secondary/20 text-secondary'
              }`}>
                2 MOIS OFFERTS
              </span>
            </button>
          </div>
        </div>

        {/* Cartes des plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const monthlyEquiv = isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
            const saving = plan.monthlyPrice * 12 - plan.annualPrice;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                  plan.popular ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02]' : 'border-gray-100'
                }`}
              >
                {/* Badge populaire */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-primary/30">
                    ⭐ Le plus populaire
                  </div>
                )}

                {/* Badge économie annuelle */}
                {isAnnual && saving > 0 && (
                  <div className="absolute -top-4 right-6 bg-secondary text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">
                    -{Math.round((saving / (plan.monthlyPrice * 12)) * 100)}%
                  </div>
                )}

                {/* Icône et nom */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: plan.color }} />
                  </div>
                  <h2 className="text-xl font-black text-foreground">{plan.name}</h2>
                </div>

                <p className="text-subtext text-sm mb-8 leading-relaxed">{plan.description}</p>

                {/* Prix */}
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-foreground">
                      {isAnnual
                        ? displayPrice.toLocaleString('fr-FR')
                        : displayPrice.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-subtext font-bold pb-1">
                      FCFA/{isAnnual ? 'an' : 'mois'}
                    </span>
                  </div>
                  {isAnnual && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-subtext font-medium">
                        soit <span className="font-bold text-primary">{monthlyEquiv.toLocaleString('fr-FR')} FCFA/mois</span>
                      </p>
                      <p className="text-xs font-bold text-secondary">
                        🎉 Vous économisez {saving.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  )}
                </div>

                {/* Fonctionnalités */}
                <ul className="space-y-3 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${plan.color}15` }}
                      >
                        <Check className="w-3 h-3" style={{ color: plan.color }} />
                      </div>
                      <span className="text-subtext font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/auth/register"
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ${
                    plan.popular
                      ? 'bg-primary text-white shadow-primary/20'
                      : 'bg-accent/30 text-foreground hover:bg-accent/60'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Note de bas de page */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-subtext text-sm font-medium">
            Vous avez des questions ? Contactez-nous directement.
          </p>
          <p className="text-xs text-subtext/60 max-w-xl mx-auto">
            Les abonnements donnent accès à la plateforme Congo Tourisme. 
            Les paiements entre visiteurs et établissements se font directement selon les modalités convenues entre les parties. 
            Securits Tech n&apos;intervient pas dans ces transactions.
          </p>
        </div>

      </div>
    </div>
  );
}
