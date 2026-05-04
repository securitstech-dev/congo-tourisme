'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Landmark, Mail, Lock, User, Loader2, ArrowRight, Plane, Building2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Prénom trop court'),
  lastName: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
  role: z.enum(['TOURIST', 'OPERATOR']).default('TOURIST'),
  plan: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as 'TOURIST' | 'OPERATOR') || 'TOURIST';
  const initialPlan = searchParams.get('plan') || undefined;

  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'TOURIST' | 'OPERATOR'>(initialRole);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      role: initialRole,
      plan: initialPlan
    }
  });

  const handleRoleChange = (role: 'TOURIST' | 'OPERATOR') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', data);
      const { user, backend_tokens } = response.data;
      setAuth(user, backend_tokens.accessToken, backend_tokens.refreshToken);
      
      // Redirection basée sur le rôle
      if (user.role === 'OPERATOR') {
        router.push('/dashboard/operator');
      } else {
        router.push('/dashboard/tourist/profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="p-8 text-center border-b border-gray-50">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Landmark className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-primary">Congo Tourisme</span>
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Rejoignez-nous</h1>
        <p className="text-sm text-subtext">Choisissez votre type de compte pour commencer.</p>
      </div>

      <div className="p-4 bg-gray-50/50 flex gap-2">
        <button
          onClick={() => handleRoleChange('TOURIST')}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            selectedRole === 'TOURIST' 
            ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
            : 'text-subtext hover:bg-gray-100'
          }`}
        >
          <Plane className="w-4 h-4" />
          Je suis un Usager
        </button>
        <button
          onClick={() => handleRoleChange('OPERATOR')}
          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            selectedRole === 'OPERATOR' 
            ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
            : 'text-subtext hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Je suis un Opérateur
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-subtext ml-1 uppercase tracking-wider">Prénom</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext/40" />
              <input
                {...register('firstName')}
                type="text"
                placeholder="Jean"
                className="w-full pl-10 pr-4 py-3 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-subtext/30"
              />
            </div>
            {errors.firstName && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-subtext ml-1 uppercase tracking-wider">Nom</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext/40" />
              <input
                {...register('lastName')}
                type="text"
                placeholder="Dupont"
                className="w-full pl-10 pr-4 py-3 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-subtext/30"
              />
            </div>
            {errors.lastName && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-subtext ml-1 uppercase tracking-wider">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext/40" />
            <input
              {...register('email')}
              type="email"
              placeholder="exemple@email.com"
              className="w-full pl-10 pr-4 py-3 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-subtext/30"
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-subtext ml-1 uppercase tracking-wider">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext/40" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-subtext/30"
            />
          </div>
          {errors.password && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Créer mon compte {selectedRole === 'OPERATOR' ? 'Opérateur' : 'Usager'} <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        <p className="text-center text-sm text-subtext pt-2">
          Vous avez déjà un compte ?{' '}
          <Link href="/auth/login" className="font-bold text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/30 p-4">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-subtext font-bold">Chargement...</p>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
