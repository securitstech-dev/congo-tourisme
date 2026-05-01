'use client';

import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci ! Votre message a été envoyé avec succès. Notre équipe vous répondra sous 24h.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-primary pt-32 pb-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Contactez-nous</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          Une question sur nos services ? Besoin d'assistance ? Notre équipe est à votre écoute pour vous accompagner dans votre expérience Congo Tourisme.
        </p>
      </div>

      <div className="container mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-accent/30 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-subtext">contact@congotourisme.cg</p>
              <p className="text-subtext">support@congotourisme.cg</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-accent/30 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Téléphone</h3>
              <p className="text-subtext">+242 06 123 45 67</p>
              <p className="text-subtext">+242 05 987 65 43</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-accent/30 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Heures d'ouverture</h3>
              <p className="text-subtext">Lundi - Vendredi : 08h00 - 18h00</p>
              <p className="text-subtext">Samedi : 09h00 - 14h00</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-xl">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-subtext">Nom complet</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Jean Dupont"
                    className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-subtext">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="jean@exemple.com"
                    className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext">Sujet</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-subtext">Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  placeholder="Détaillez votre demande ici..."
                  className="w-full px-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                <Send className="w-5 h-5" />
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
