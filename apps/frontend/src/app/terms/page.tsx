'use client';

import { Gavel, Scale, AlertTriangle, CheckSquare } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl bg-white p-12 md:p-20 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8 text-primary">
          <Gavel className="w-10 h-10" />
          <h1 className="text-4xl font-black text-foreground">Conditions Générales</h1>
        </div>
        
        <p className="text-subtext mb-12 text-lg">
          Bienvenue sur Congo Tourisme. En utilisant notre plateforme, vous acceptez sans réserve les présentes conditions d'utilisation.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-secondary" />
              1. Rôles et Responsabilités
            </h2>
            <p className="text-subtext leading-relaxed">
              Congo Tourisme agit en tant qu'intermédiaire technique entre les Opérateurs touristiques et les Voyageurs. Les Opérateurs sont seuls responsables de la qualité et de la véracité des services proposés dans leurs annonces.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-secondary" />
              2. Réservations et Paiements
            </h2>
            <p className="text-subtext leading-relaxed">
              Toute réservation effectuée sur la plateforme est ferme dès confirmation du paiement. Les paiements sont sécurisés par Stripe (international) ou par Mobile Money (MTN/Airtel) pour l'Afrique. Les fonds sont reversés aux opérateurs après prélèvement de la commission de service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-secondary" />
              3. Annulations et Remboursements
            </h2>
            <p className="text-subtext leading-relaxed">
              Chaque opérateur définit ses propres conditions d'annulation. En cas de litige, Congo Tourisme intervient en tant que médiateur, mais le remboursement final dépend des conditions acceptées lors de la réservation.
            </p>
          </section>

          <section className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
            <h3 className="font-bold text-orange-800 mb-2">Note Importante</h3>
            <p className="text-sm text-orange-700">
              L'utilisation frauduleuse de la plateforme ou la publication de contenus inappropriés entraînera la suspension immédiate du compte sans préavis.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
