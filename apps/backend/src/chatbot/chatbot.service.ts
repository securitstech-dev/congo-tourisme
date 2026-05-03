import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class ChatbotService {
  private anthropic: Anthropic;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    this.anthropic = new Anthropic({ apiKey });
  }

  async askKongo(message: string) {
    const knowledge = await this.prisma.chatbotKnowledge.findMany({
      where: { isActive: true },
    });

    try {
      const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
      
      // Fallback si la clé n'est pas configurée (mode démo)
      if (!apiKey || apiKey.length < 10 || apiKey.includes('placeholder')) {
        return this.mockResponse(message, knowledge);
      }

      // 1. Récupérer quelques annonces pour donner du contexte concret
      const topListings = await this.prisma.listing.findMany({
        take: 10,
        include: { operator: true },
      });

      const knowledgeContext = knowledge.map(k => 
        `### ${k.topic}\n${k.content}`
      ).join('\n\n');

      const listingsContext = topListings.map(l => 
        `- ${l.title} (${l.listingType}) à ${l.operator.city}: ${l.description.substring(0, 150)}...`
      ).join('\n');

      const systemPrompt = `Tu es "Kongo", l'expert ultime du tourisme en République du Congo (Brazzaville).
        Ta mission est d'être l'ambassadeur digital du pays. 
        
        IDENTITÉ :
        - Nom : Kongo.
        - Personnalité : Chaleureux, fier, cultivé, professionnel.
        - Langues : Français (principal), Anglais (si besoin).
        - Expressions : Mbote, Matondo, Losako.

        CONNAISSANCES SPÉCIFIQUES (Éducation de l'Admin) :
        ${knowledgeContext || "Aucune consigne spécifique de l'admin pour le moment."}

        LISTE DES ÉTABLISSEMENTS PARTENAIRES :
        ${listingsContext}

        RÈGLES CRITIQUES :
        1. Si un utilisateur pose une question à laquelle tu ne connais pas la réponse, ou si l'information ne figure pas dans tes connaissances ci-dessus, réponds EXACTEMENT ceci : "Je m'en excuse, mais je n'ai pas encore cette information précise en mémoire. Je vous invite à poser votre question directement à l'administrateur via le formulaire de contact ou par email."
        2. Ne jamais inventer (halluciner) des faits historiques, géographiques ou des tarifs.
        3. Fais toujours la distinction entre la République du Congo (Brazzaville) et la RDC. Nous sommes à Brazzaville.
        4. Pour toute question sur les abonnements opérateurs ou les tarifs techniques, renvoie vers la page Tarifs ou l'Admin.
        5. Sois concis et accueillant.`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
      });

      const text = response.content[0].type === 'text' ? (response.content[0] as any).text : '';
      return { response: text };
      
    } catch (error) {
      console.error('Chatbot Error:', error);
      // Fallback intelligent en cas d'erreur API
      return this.mockResponse(message, knowledge);
    }
  }

  private mockResponse(message: string, knowledge: any[]) {
    const msg = message.toLowerCase();
    
    // 1. Recherche par mot-clé dans la base de connaissances
    const match = knowledge.find(k => 
      msg.includes(k.topic.toLowerCase()) || k.content.toLowerCase().includes(msg)
    );

    if (match) {
      return { response: match.content };
    }

    // 2. Réponses de base
    if (msg.includes('mbote') || msg.includes('bonjour') || msg.includes('salut')) {
      return { response: "Mbote ! Je suis Kongo, votre guide expert. Comment puis-je vous aider à explorer les merveilles du Congo ?" };
    }

    if (msg.includes('qui es-tu') || msg.includes('ton nom')) {
      return { response: "Je suis Kongo, l'intelligence artificielle dédiée au tourisme en République du Congo. Je suis là pour vous guider !" };
    }

    // 3. Fallback final
    return { response: "Je m'en excuse, mais je n'ai pas encore cette information précise en mémoire (Mode Démo). Je vous invite à poser votre question directement à l'administrateur." };
  }

  // Méthodes pour l'administration de la connaissance
  async addKnowledge(data: { topic: string; content: string }) {
    return this.prisma.chatbotKnowledge.create({ data });
  }

  async getAllKnowledge() {
    return this.prisma.chatbotKnowledge.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteKnowledge(id: string) {
    return this.prisma.chatbotKnowledge.delete({ where: { id } });
  }
}
