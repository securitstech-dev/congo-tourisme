'use client';

import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, CreditCard, ArrowRight } from 'lucide-react';

export default function BookingSuccess() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-xl w-full bg-white rounded-[40px] p-12 border border-gray-100 shadow-2xl shadow-primary/5 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-black mb-4">Réservation Confirmée !</h1>
        <p className="text-subtext mb-12 text-lg">
          Votre demande de réservation a été envoyée à l'opérateur. Vous recevrez une confirmation par email et SMS sous peu.
        </p>

        <div className="bg-accent/10 rounded-3xl p-8 mb-12 space-y-6 text-left">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-subtext uppercase tracking-wider">Dates</p>
              <p className="font-bold">12 Mai - 15 Mai 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-subtext uppercase tracking-wider">Établissement</p>
              <p className="font-bold">Grand Hôtel de Pointe-Noire</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-subtext uppercase tracking-wider">Total payé</p>
              <p className="font-black text-xl text-primary">135 000 FCFA</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/dashboard/tourist/bookings" 
            className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Gérer mes réservations
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/explore" 
            className="text-subtext font-bold hover:text-foreground transition-colors"
          >
            Continuer mes découvertes
          </Link>
        </div>
      </div>
    </div>
  );
}
