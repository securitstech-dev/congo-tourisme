'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ShieldCheck, 
  FileText, 
  Building2, 
  Upload, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';

const onboardingSchema = z.object({
  companyName: z.string().min(3, "Le nom de l'entreprise est requis"),
  rccmNumber: z.string().min(5, "Le numéro RCCM est requis"),
  taxId: z.string().min(5, "Le numéro NIU est requis"),
  legalAddress: z.string().min(10, "L'adresse légale est requise"),
  managerName: z.string().min(3, "Le nom du gérant est requis"),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OperatorOnboarding() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, formState: { errors } } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema) as any
  });

  const onSubmit = async (data: OnboardingValues) => {
    setIsLoading(true);
    // Simulation d'envoi des documents
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 2000);
  };

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black mb-4">Dossier soumis avec succès !</h1>
        <p className="text-subtext mb-10 text-lg">
          Nos équipes de Securits Tech vont examiner vos documents administratifs sous 48h. 
          Vous recevrez un email dès que votre compte sera validé et votre abonnement activé.
        </p>
        <button 
          onClick={() => router.push('/dashboard/operator')}
          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
        >
          Aller au tableau de bord
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-4 bg-secondary/10 rounded-2xl">
          <ShieldCheck className="w-8 h-8 text-secondary" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-foreground">Validation Administrative</h1>
          <p className="text-subtext">Complétez votre dossier pour commencer à publier vos offres.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <>
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Informations sur l'établissement
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-subtext">Nom officiel de l'entreprise</label>
                  <input 
                    {...register('companyName')}
                    className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
                    placeholder="Ex: SARL Congo Prestige"
                  />
                  {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-subtext">Numéro RCCM</label>
                  <input 
                    {...register('rccmNumber')}
                    className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
                    placeholder="Ex: CG-PNR-01-2024-B12..."
                  />
                  {errors.rccmNumber && <p className="text-red-500 text-xs">{errors.rccmNumber.message as string}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext">Adresse du siège social</label>
                <input 
                  {...register('legalAddress')}
                  className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
                  placeholder="Ex: 45 Avenue de l'indépendance, Pointe-Noire"
                />
                {errors.legalAddress && <p className="text-red-500 text-xs">{errors.legalAddress.message as string}</p>}
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Documents justificatifs (PDF ou Images)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentUpload label="RCCM (Registre du Commerce)" />
                <DocumentUpload label="NIU (Numéro d'Identification Unique)" />
                <DocumentUpload label="Licence d'exploitation touristique" />
                <DocumentUpload label="Pièce d'identité du gérant" />
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>Tous les documents doivent être en cours de validité et lisibles pour éviter un refus.</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleSubmit(() => setStep(2))}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3"
            >
              Continuer vers le choix de l'abonnement
            </button>
          </>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Choisissez votre formule</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-accent rounded-[32px] p-8 cursor-pointer hover:border-primary transition-all relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-full text-xs font-bold uppercase">Populaire</span>
                <h3 className="text-xl font-bold text-foreground">Abonnement Mensuel</h3>
                <p className="text-3xl font-black text-primary my-4">25.000 <span className="text-sm text-subtext">FCFA/mois</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-subtext"><CheckCircle2 className="w-4 h-4 text-green-500" /> Annonces illimitées</li>
                  <li className="flex items-center gap-2 text-sm text-subtext"><CheckCircle2 className="w-4 h-4 text-green-500" /> Réservations directes</li>
                  <li className="flex items-center gap-2 text-sm text-subtext"><CheckCircle2 className="w-4 h-4 text-green-500" /> Sans commission</li>
                </ul>
              </div>

              <div className="bg-primary border-2 border-primary rounded-[32px] p-8 cursor-pointer shadow-xl shadow-primary/20 text-white relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold uppercase">Économique</span>
                <h3 className="text-xl font-bold">Abonnement Annuel</h3>
                <p className="text-3xl font-black my-4">250.000 <span className="text-sm opacity-80">FCFA/an</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm opacity-90"><CheckCircle2 className="w-4 h-4 text-yellow-400" /> 2 mois offerts</li>
                  <li className="flex items-center gap-2 text-sm opacity-90"><CheckCircle2 className="w-4 h-4 text-yellow-400" /> Badge "Premium" garanti</li>
                  <li className="flex items-center gap-2 text-sm opacity-90"><CheckCircle2 className="w-4 h-4 text-yellow-400" /> Support prioritaire</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-2xl text-center mt-6 border border-orange-100">
              <p className="text-sm text-orange-800 font-bold mb-4">Moyen de paiement</p>
              <div className="flex justify-center gap-4">
                <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl cursor-pointer shadow-sm border border-orange-200">
                  <input type="radio" name="payment" defaultChecked className="text-primary focus:ring-primary" />
                  <span className="text-sm font-bold text-foreground">Mobile Money (MTN/Airtel)</span>
                </label>
                <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl cursor-pointer shadow-sm border border-orange-200">
                  <input type="radio" name="payment" className="text-primary focus:ring-primary" />
                  <span className="text-sm font-bold text-foreground">Paiement en espèces (Siège)</span>
                </label>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3 mt-8"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirmer et Soumettre mon dossier"}
            </button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-subtext py-3 rounded-2xl font-bold hover:bg-accent/30 transition-all mt-2"
            >
              Retour aux documents
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function DocumentUpload({ label }: { label: string }) {
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
      isUploaded ? 'border-green-500 bg-green-50' : 'border-accent/40 hover:border-primary/40'
    }`}
    onClick={() => setIsUploaded(true)}>
      {isUploaded ? (
        <>
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <span className="text-xs font-bold text-green-600">Document ajouté</span>
        </>
      ) : (
        <>
          <Upload className="w-8 h-8 text-subtext/40" />
          <span className="text-xs font-bold text-subtext">{label}</span>
        </>
      )}
    </div>
  );
}
