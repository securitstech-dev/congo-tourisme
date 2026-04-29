import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class ChatbotService {
  private anthropic: Anthropic;

  constructor(private configService: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async askKongo(message: string) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620', // Version la plus rcente stable
        max_tokens: 1024,
        system: `Tu es "Kongo", un agent expert du tourisme en République du Congo. 
        Ton but est d'aider les voyageurs à découvrir les merveilles du pays (Brazzaville, Pointe-Noire, Parc National d'Odzala-Kokoua, Gorges de Diosso, etc.).
        Ta personnalité est : Chaleureuse, accueillante, professionnelle, et fière de la culture congolaise.
        Tu parles principalement français, mais tu peux répondre en anglais si on te sollicite.
        Tu dois toujours promouvoir les expériences locales authentiques et le tourisme durable.
        N'hésite pas à utiliser quelques expressions locales congolaises (lingala ou kituba) avec leur traduction pour ajouter de la saveur locale.
        Réponds de manière concise et structurée.`,
        messages: [{ role: 'user', content: message }],
      });

      // Typage de la réponse
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
