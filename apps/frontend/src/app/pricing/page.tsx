import { Check, Zap, Shield, Crown } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: "Pack Découverte",
    price: "15 000",
    description: "Parfait pour les petits établissements et artisans locaux.",
    features: [
      "Jusqu'à 3 annonces actives",
      "Photos standard (max 5 par annonce)",
      "Gestion des réservations basique",
      "Support par email",
      "14 jours d'essai gratuit"
    ],
    cta: "Essayer gratuitement",
    icon: Zap,
    popular: false,
    color: "gray"
  },
  {
    name: "Pack Business",
    price: "45 000",
    description: "Le choix idéal pour les hôtels et restaurants établis.",
    features: [
      "Annonces illimitées",
      "Photos HD illimitées",
      "Badge 'Vérifié' sur le profil",
      "Statistiques de performance",
      "Support prioritaire 24/7",
      "Mise en avant dans les recherches",
      "14 jours d'essai gratuit"
    ],
    cta: "Démarrer l'essai",
    icon: Shield,
    popular: true,
    color: "primary"
  },
  {
    name: "Pack Prestige",
    price: "120 000",
    description: "Pour les agences et grands complexes hôteliers.",
    features: [
      "Tout du Pack Business",
      "Service de photographie pro inclus",
      "Gestionnaire de compte dédié",
      "Accès API pour synchronisation",
      "Publicité sur la page d'accueil",
      "Assistance marketing Congo Tourisme",
      "14 jours d'essai gratuit"
    ],
    cta: "Contacter la direction",
    icon: Crown,
    popular: false,
    color: "secondary"
  }
];

export default function PricingPage() {
  return (
    <div className="bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Des prix adaptés à la croissance de votre <span className="text-primary underline decoration-secondary">activité</span>
          </h1>
          <p className="text-xl text-subtext">
            Rejoignez la plus grande marketplace touristique du Congo. Profitez de <span className="font-bold text-primary">14 jours d'essai gratuit</span> sur tous nos packs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'border-primary shadow-xl shadow-primary/10' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  LE PLUS POPULAIRE
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                plan.color === 'primary' ? 'bg-primary/10 text-primary' : 
                plan.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-500'
              }`}>
                <plan.icon className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-subtext text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-foreground">{plan.price}</span>
                <span className="text-subtext font-bold">FCFA / mois</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-medium">
                    <div className="mt-1 bg-green-100 rounded-full p-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/auth/register"
                className={`w-full py-4 rounded-2xl font-bold text-center block transition-all ${
                  plan.popular 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90' 
                    : 'bg-accent/30 text-foreground hover:bg-accent/50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'un pack sur mesure ?</h2>
          <p className="text-subtext mb-8 max-w-2xl mx-auto">
            Pour les réseaux d'hôtels ou les institutions gouvernementales, nous proposons des solutions adaptées à grande échelle avec des fonctionnalités personnalisées.
          </p>
          <Link href="/contact" className="text-primary font-bold hover:underline">
            Contactez notre équipe commerciale →
          </Link>
        </div>
      </div>
    </div>
  );
}
