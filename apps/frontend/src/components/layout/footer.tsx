import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Identity */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <span className="bg-primary px-2 py-1 rounded-lg text-white">CONGO</span>
              <span className="text-white">TOURISME</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              La plateforme de référence pour découvrir la beauté sauvage et la richesse culturelle de la République du Congo. Une initiative de Securits Tech.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-secondary pl-3">Découvrir</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/explore" className="hover:text-primary transition-colors">Destinations phares</Link></li>
              <li><Link href="/explore?type=HOTEL" className="hover:text-primary transition-colors">Hôtels & Lodges</Link></li>
              <li><Link href="/explore?type=RESTAURANT" className="hover:text-primary transition-colors">Gastronomie</Link></li>
              <li><Link href="/explore?type=SITE" className="hover:text-primary transition-colors">Sites touristiques</Link></li>
              <li><Link href="/guides" className="hover:text-primary transition-colors">Guides de voyage</Link></li>
            </ul>
          </div>

          {/* Institutional / Operators */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-secondary pl-3">Partenaires</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/auth/register" className="hover:text-primary transition-colors">Devenir Opérateur</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Packs d'abonnement</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">À propos de nous</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact & Support</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-secondary pl-3">Newsletter</h4>
            <p className="text-gray-400 mb-6 text-sm">
              Inscrivez-vous pour recevoir nos offres exclusives et les derniers trésors du Congo.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="votre@email.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary p-2.5 rounded-lg hover:opacity-90 transition-opacity">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+242 06 123 45 67</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-secondary" />
                <span>contact@congotourisme.cg</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>Pointe-Noire, République du Congo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Congo Tourisme. Développé par Securits Tech.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Vie privée</Link>
            <Link href="/terms" className="hover:text-white transition-colors">CGV / CGU</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
