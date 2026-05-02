import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  private anthropic: Anthropic | null = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
    }
  }

  async askKongo(message: string) {
    try {
      // Récupérer quelques annonces populaires pour donner du contexte à l'IA
      const topListings = await this.prisma.listing.findMany({
        take: 5,
        include: { operator: true },
      });

      const listingsContext = topListings.map(l => 
        `- ${l.title} (${l.listingType}) à ${l.operator.city}: ${l.description.substring(0, 100)}...`
      ).join('\n');

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620', // Utilisation de la version stable la plus performante
        max_tokens: 1024,
        system: `Tu es "Kongo", un agent expert du tourisme en République du Congo. 
        Ton but est d'aider les voyageurs à découvrir les merveilles du pays (Brazzaville, Pointe-Noire, Parc National d'Odzala-Kokoua, Gorges de Diosso, etc.).
        Ta personnalité est : Chaleureuse, accueillante, professionnelle, et fière de la culture congolaise.
        
        Voici quelques établissements actuellement disponibles sur notre plateforme que tu peux recommander si pertinent :
        ${listingsContext}

        Consignes :
        1. Tu parles principalement français, mais tu peux répondre en anglais si on te sollicite.
        2. Tu dois toujours promouvoir les expériences locales authentiques et le tourisme durable.
        3. Utilise quelques expressions locales (lingala/kituba) comme "Mbote" (Bonjour), "Matondo" (Merci), "Na kopesa yo losako" (Je te salue).
        4. Réponds de manière concise et structurée.
        5. Si on te pose des questions sur les prix ou réservations, invite l'utilisateur à consulter les fiches détaillées sur le site.`,
        messages: [{ role: 'user', content: message }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return { response: content.text };
      }
      
      throw new Error('Unexpected response format from Anthropic');
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new InternalServerErrorException('Erreur lors de la communication avec Kongo.');
    }
  }
}
