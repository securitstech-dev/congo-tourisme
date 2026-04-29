'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Landmark, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', data);
      const { user, backend_tokens } = response.data;
      setAuth(user, backend_tokens.accessToken, backend_tokens.refreshToken);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/30 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Landmark className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-bold text-primary">Congo Tourisme</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">Bon retour parmi nous !</h1>
          <p className="text-subtext">Connectez-vous pour gérer vos réservations.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-bold text-subtext ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
              <input
                {...register('email')}
                type="email"
                placeholder="exemple@email.com"
                className="w-full pl-12 pr-4 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-subtext/30"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-subtext">Mot de passe</label>
              <Link href="#" className="text-xs font-bold text-primary hover:underline">Oublié ?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-subtext/30"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Se connecter <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-subtext pt-4">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="font-bold text-primary hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
