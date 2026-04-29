import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chatbot')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post('ask')
  @UseGuards(JwtAuthGuard) // Optionnel selon si on veut le rendre public ou pas, mais AGENTS.md suggre que les touristes l'utilisent.
  ask(@Body() chatDto: ChatDto) {
    return this.chatbotService.askKongo(chatDto.message);
  }
}
