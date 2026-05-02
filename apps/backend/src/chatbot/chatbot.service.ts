import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async askKongo(message: string) {
    try {
      const apiKey = this.configService.get<string>('GROQ_API_KEY');
      if (!apiKey) {
        throw new InternalServerErrorException('Clé API Groq non configurée sur le serveur.');
      }

      // Récupérer quelques annonces populaires pour donner du contexte à l'IA
      const topListings = await this.prisma.listing.findMany({
        take: 5,
        include: { operator: true },
      });

      const listingsContext = topListings.map(l => 
        `- ${l.title} (${l.listingType}) à ${l.operator.city}: ${l.description.substring(0, 100)}...`
      ).join('\n');

      const systemPrompt = `Tu es "Kongo", un agent expert du tourisme en République du Congo. 
        Ton but est d'aider les voyageurs à découvrir les merveilles du pays (Brazzaville, Pointe-Noire, Parc National d'Odzala-Kokoua, Gorges de Diosso, etc.).
        Ta personnalité est : Chaleureuse, accueillante, professionnelle, et fière de la culture congolaise.
        
        Voici quelques établissements actuellement disponibles sur notre plateforme que tu peux recommander si pertinent :
        ${listingsContext}

        Consignes :
        1. Tu parles principalement français, mais tu peux répondre en anglais si on te sollicite.
        2. Tu dois toujours promouvoir les expériences locales authentiques et le tourisme durable.
        3. Utilise quelques expressions locales (lingala/kituba) comme "Mbote" (Bonjour), "Matondo" (Merci), "Na kopesa yo losako" (Je te salue).
        4. Réponds de manière concise et structurée.
        5. Si on te pose des questions sur les prix ou réservations, invite l'utilisateur à consulter les fiches détaillées sur le site.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_completion_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API Error:', errorData);
        throw new Error(`Groq API returned ${response.status}`);
      }

      const data = await response.json();
      return { response: data.choices[0].message.content };
      
    } catch (error) {
      console.error('Chatbot Error:', error);
      throw new InternalServerErrorException('Erreur lors de la communication avec Kongo.');
    }
  }
}
