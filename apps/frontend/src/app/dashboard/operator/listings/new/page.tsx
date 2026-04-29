'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Upload, 
  Info, 
  MapPin, 
  Tag, 
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
  Plus,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

const listingSchema = z.object({
  title: z.string().min(5, 'Le titre doit faire au moins 5 caractères'),
  description: z.string().min(20, 'La description doit faire au moins 20 caractères'),
  type: z.enum(['HOTEL', 'RESTAURANT', 'SITE', 'AGENCY', 'OTHER']),
  location: z.string().min(3, 'La localisation est requise'),
  price: z.number().min(0, 'Le prix doit être positif'),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export default function NewListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      type: 'HOTEL',
      price: 0
    }
  });

  const onSubmit = async (data: ListingFormValues) => {
    setIsLoading(true);
    try {
      await api.post('/listings', data);
      router.push('/dashboard/operator/listings');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Une erreur est survenue lors de la création de l\'annonce.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Informations de base', icon: Info },
    { id: 2, label: 'Localisation & Prix', icon: MapPin },
    { id: 3, label: 'Photos & Validation', icon: ImageIcon },
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link href="/dashboard/operator/listings" className="inline-flex items-center gap-2 text-subtext hover:text-primary font-bold transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Retour aux annonces
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Ajouter une nouvelle annonce</h1>
        <p className="text-subtext">Créez une offre attractive pour attirer plus de voyageurs.</p>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between px-8">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              currentStep >= step.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-accent/30 text-subtext'
            }`}>
              {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
            </div>
            <span className={`hidden md:block font-bold text-sm ${currentStep >= step.id ? 'text-foreground' : 'text-subtext/60'}`}>
              {step.label}
            </span>
            {i < steps.length - 1 && <ChevronRight className="hidden md:block w-4 h-4 text-subtext/20 ml-4" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Dites-nous en plus sur votre offre</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext ml-1">Titre de l'annonce</label>
              <input 
                {...register('title')}
                type="text" 
                placeholder="Ex: Chambre Deluxe avec vue sur mer - Pointe-Noire"
                className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext ml-1">Type d'offre</label>
              <select 
                {...register('type')}
                className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium cursor-pointer"
              >
                <option value="HOTEL">Hôtel / Lodge</option>
                <option value="RESTAURANT">Restaurant / Bar</option>
                <option value="SITE">Site Touristique</option>
                <option value="AGENCY">Agence de voyage</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext ml-1">Description détaillée</label>
              <textarea 
                {...register('description')}
                rows={6}
                placeholder="Décrivez les points forts de votre offre..."
                className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium resize-none"
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{errors.description.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Où se trouve votre offre et quel est son prix ?</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext ml-1">Localisation (Ville, Quartier)</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
                <input 
                  {...register('location')}
                  type="text" 
                  placeholder="Ex: Pointe-Noire, Côte Sauvage"
                  className="w-full pl-16 pr-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>
              {errors.location && <p className="text-red-500 text-xs mt-1 ml-1">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-subtext ml-1">Prix par nuit / service (FCFA)</label>
              <div className="relative">
                <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
                <input 
                  {...register('price', { valueAsNumber: true })}
                  type="number" 
                  placeholder="0"
                  className="w-full pl-16 pr-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-primary text-xl"
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1 ml-1">{errors.price.message}</p>}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Finalisez votre annonce</h2>
            <p className="text-subtext">Vérifiez vos informations avant de publier.</p>
            
            <div className="bg-accent/10 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between border-b border-white pb-2">
                <span className="text-subtext">Titre</span>
                <span className="font-bold">{watch('title')}</span>
              </div>
              <div className="flex justify-between border-b border-white pb-2">
                <span className="text-subtext">Prix</span>
                <span className="font-bold text-primary">{watch('price')} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-subtext">Localisation</span>
                <span className="font-bold">{watch('location')}</span>
              </div>
            </div>

            <div className="border-4 border-dashed border-accent/40 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
              <ImageIcon className="text-primary w-10 h-10 mb-4 opacity-40" />
              <p className="text-sm text-subtext">L'upload d'images Cloudinary sera configuré lors de la prochaine étape.</p>
            </div>
          </div>
        )}

        <div className="p-8 bg-accent/5 border-t border-gray-100 flex items-center justify-between">
          <button 
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isLoading}
            className="px-8 py-3 text-subtext font-bold hover:text-foreground transition-colors disabled:opacity-30"
          >
            Précédent
          </button>
          
          {currentStep < 3 ? (
            <button 
              type="button"
              onClick={handleNext}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
            >
              Continuer
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publier l\'annonce'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
