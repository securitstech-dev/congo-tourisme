'use client';

import { useState, useEffect } from 'react';
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
  AlertCircle,
  MapPin,
  CreditCard
} from 'lucide-react';
import api from '@/lib/api';

const onboardingSchema = z.object({
  businessName: z.string().min(3, "Le nom de l'établissement est requis"),
  rccmNumber: z.string().min(5, "Le numéro RCCM est requis"),
  taxId: z.string().min(5, "Le numéro NIU est requis"),
  legalAddress: z.string().min(10, "L'adresse légale est requise"),
  managerName: z.string().min(3, "Le nom du gérant est requis"),
  phone: z.string().min(9, "Le numéro de téléphone est requis"),
  city: z.string().min(2, "La ville est requise"),
  region: z.string().min(2, "La région est requise"),
});

const REQUIRED_DOCS = [
  { id: 'RCCM', label: 'Registre du Commerce (RCCM)' },
  { id: 'SCIET', label: 'Certificat SCIET' },
  { id: 'SCIEN', label: 'Certificat SCIEN' },
  { id: 'SAFETY_QUITUS', label: 'Quitus Sapeurs-Pompiers' },
  { id: 'MANAGER_ID', label: 'CNI du Gérant (Recto/Verso)' },
  { id: 'NATIONALITY_CERT', label: 'Certificat de Nationalité' },
  { id: 'TAX_PAYMENT', label: 'Dernier Quitus Fiscal' },
  { id: 'MUNICIPAL_AUTH', label: 'Autorisation de la Mairie' },
  { id: 'MINISTRY_AUTH', label: 'Autorisation Ministère de Tutelle' },
];

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OperatorOnboarding() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Commencer en chargement
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'BUSINESS' | 'PREMIUM'>('BUSINESS');
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema) as any
  });

  // Vérifier l'état initial au chargement
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get('/operators/me'); // Endpoint à vérifier/créer
        const op = res.data;
        
        if (op) {
          // Si déjà validé, on sort de là
          if (op.isValidated) {
            router.push('/dashboard/operator');
            return;
          }

          // Pré-remplir le formulaire
          reset({
            businessName: op.businessName || '',
            rccmNumber: op.rccmNumber || '',
            taxId: op.taxId || '',
            legalAddress: op.legalAddress || '',
            managerName: op.managerName || '',
            phone: op.phone || '',
            city: op.city || '',
            region: op.region || '',
          });

          // Récupérer les types de docs déjà uploadés
          if (op.documents && Array.isArray(op.documents)) {
            const docTypes = op.documents.map((d: any) => d.type);
            setUploadedDocs(docTypes);
            
            // Si tous les docs sont là et qu'il a un businessName, on montre l'étape "Soumis"
            if (docTypes.length >= REQUIRED_DOCS.length && op.businessName) {
              setStep(4);
            }
          }
        }
      } catch (error) {
        console.error("Erreur check status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [reset, router]);

  const onSubmit = async (data: OnboardingValues) => {
    if (uploadedDocs.length < REQUIRED_DOCS.length) {
      alert("Veuillez télécharger tous les documents obligatoires avant de soumettre.");
      return;
    }
    setIsLoading(true);
    try {
      // 1. Mettre à jour le profil opérateur
      await api.patch('/operators/profile', {
        ...data,
        subscriptionPlan: selectedPlan,
      });

      // 2. Passer à l'étape succès
      setStep(4);
    } catch (error) {
      alert("Une erreur est survenue lors de l'enregistrement de votre dossier.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (type: string, file: File) => {
    setUploadingDoc(type);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      await api.post('/operators/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadedDocs(prev => [...prev, type]);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Erreur inconnue";
      alert(`Erreur lors du téléchargement : ${message}`);
    } finally {
      setUploadingDoc(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-subtext font-bold animate-pulse text-sm uppercase tracking-widest">Vérification de votre dossier...</p>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black mb-4 text-foreground">Dossier soumis !</h1>
        <p className="text-subtext mb-10 text-lg leading-relaxed">
          Merci pour votre confiance. Nos équipes **Securits Tech** (Pointe-Noire) examinent vos documents sous 48h. 
          <br /><br />
          Vous recevrez un email de confirmation dès que votre établissement sera visible sur la plateforme.
        </p>
        <button 
          onClick={() => router.push('/dashboard/operator')}
          className="bg-primary text-white px-12 py-5 rounded-[24px] font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
        >
          Accéder à mon espace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center gap-6 mb-16">
        <div className="p-5 bg-secondary text-white rounded-3xl shadow-xl shadow-secondary/20">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Onboarding Opérateur</h1>
          <p className="text-subtext font-medium">Finalisez votre inscription légale pour commencer à vendre.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step === i ? 'bg-primary text-white' : step > i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
            </div>
            <span className={`text-sm font-bold whitespace-nowrap ${step === i ? 'text-foreground' : 'text-subtext'}`}>
              {i === 1 ? 'Infos Légales' : i === 2 ? 'Documents' : 'Abonnement'}
            </span>
            {i < 3 && <div className="w-8 h-[2px] bg-gray-100 mx-2" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm space-y-8">
                <h2 className="text-xl font-black flex items-center gap-3 text-foreground">
                  <Building2 className="w-6 h-6 text-primary" />
                  Identité de l'établissement
                </h2>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-subtext uppercase tracking-widest">Nom Commercial</label>
                    <input 
                      {...register('businessName')}
                      className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold placeholder:text-subtext/40"
                      placeholder="Ex: Hôtel de la Paix"
                    />
                    {errors.businessName && <p className="text-red-500 text-[10px] font-bold">{errors.businessName.message as string}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-subtext uppercase tracking-widest">RCCM</label>
                      <input 
                        {...register('rccmNumber')}
                        className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                        placeholder="N° Registre"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-subtext uppercase tracking-widest">NIU (Tax ID)</label>
                      <input 
                        {...register('taxId')}
                        className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                        placeholder="N° NIU"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-subtext uppercase tracking-widest">Nom du Gérant</label>
                    <input 
                      {...register('managerName')}
                      className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm space-y-8">
                <h2 className="text-xl font-black flex items-center gap-3 text-foreground">
                  <MapPin className="w-6 h-6 text-primary" />
                  Localisation & Contact
                </h2>
                
                <div className="space-y-5">
                   <div className="space-y-2">
                    <label className="text-xs font-black text-subtext uppercase tracking-widest">Téléphone Professionnel</label>
                    <input 
                      {...register('phone')}
                      className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                      placeholder="+242..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-subtext uppercase tracking-widest">Ville</label>
                      <input 
                        {...register('city')}
                        className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-subtext uppercase tracking-widest">Région</label>
                      <input 
                        {...register('region')}
                        className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-subtext uppercase tracking-widest">Adresse Siège Social</label>
                    <textarea 
                      {...register('legalAddress')}
                      rows={2}
                      className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-foreground text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-black mb-2">Presque terminé...</h3>
                    <p className="text-white/60 font-medium">L'étape suivante est cruciale : vos pièces justificatives.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-primary text-white px-10 py-5 rounded-[24px] font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    Suivant : Documents
                  </button>
               </div>
               <ShieldCheck className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5" />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-black mb-6 text-foreground flex items-center gap-3">
                <FileText className="w-7 h-7 text-primary" />
                Dossier Administratif (Congo)
              </h2>
              <p className="text-subtext mb-10 font-medium">
                Conformément à la réglementation nationale, veuillez joindre les documents suivants en format Image ou PDF.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REQUIRED_DOCS.map((doc) => (
                  <div key={doc.id} className={`p-6 rounded-3xl border-2 transition-all ${
                    uploadedDocs.includes(doc.id) ? 'border-green-100 bg-green-50' : 'border-dashed border-gray-100 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-subtext uppercase tracking-widest">{doc.label}</span>
                      {uploadedDocs.includes(doc.id) && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>
                    
                    <label className="relative flex items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:bg-accent/10 transition-all group">
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(doc.id, e.target.files[0])}
                        disabled={uploadingDoc === doc.id}
                      />
                      {uploadingDoc === doc.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-bold text-foreground">
                            {uploadedDocs.includes(doc.id) ? 'Remplacer le fichier' : 'Télécharger'}
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 rounded-2xl font-bold text-subtext hover:bg-gray-50 transition-all"
                >
                  Retour
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={uploadedDocs.length < REQUIRED_DOCS.length}
                  className="flex-[2] bg-primary text-white py-5 rounded-[24px] font-black shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  Suivant : Pack & Essai
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-12">
            <h2 className="text-3xl font-black text-center text-foreground">Choisissez votre formule</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { key: 'STARTER', label: 'Starter', price: '15.000', color: 'bg-blue-500', desc: 'Idéal pour débuter' },
                { key: 'BUSINESS', label: 'Business', price: '25.000', color: 'bg-primary', desc: 'Le plus populaire', popular: true },
                { key: 'PREMIUM', label: 'Premium', price: '45.000', color: 'bg-secondary', desc: 'Visibilité maximale' },
              ].map((p: any) => (
                <div 
                  key={p.key}
                  onClick={() => setSelectedPlan(p.key)}
                  className={`relative p-8 rounded-[40px] cursor-pointer transition-all border-4 ${
                    selectedPlan === p.key ? `border-${p.key === 'BUSINESS' ? 'primary' : 'secondary'} bg-white shadow-2xl scale-105` : 'border-transparent bg-white/50 grayscale opacity-60'
                  }`}
                >
                  {p.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Recommandé</span>}
                  <div className={`w-12 h-12 ${p.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-1">{p.label}</h3>
                  <p className="text-[10px] font-bold text-subtext uppercase tracking-widest mb-6">{p.desc}</p>
                  <p className="text-3xl font-black text-foreground">
                    {p.price} <span className="text-xs text-subtext font-bold">FCFA / mois</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8 text-orange-600">
                <AlertCircle className="w-6 h-6" />
                <p className="font-bold">Note sur le paiement</p>
              </div>
              <p className="text-subtext font-medium leading-relaxed mb-8">
                Pour ce lancement, les paiements se font par **Mobile Money (MTN/Airtel)** ou par **virement bancaire**. 
                Une fois votre dossier validé, vous recevrez les coordonnées de paiement de Securits Tech.
              </p>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-6 rounded-[24px] font-black shadow-2xl shadow-primary/30 hover:opacity-90 transition-all flex items-center justify-center gap-3"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Soumettre mon dossier d'opérateur"}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-subtext py-4 font-bold hover:text-foreground transition-all mt-4"
              >
                Retour aux informations légales
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
