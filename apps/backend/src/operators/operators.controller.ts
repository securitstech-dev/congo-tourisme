import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('operators')
@UseGuards(JwtAuthGuard)
export class OperatorsController {
  constructor(private operatorsService: OperatorsService) {}

  @Get('me')
  getMe(@Req() req) {
    return this.operatorsService.findByUserId(req.user.id);
  }

  @Get('stats')
  async getStats(@Req() req) {
    // Implement stats logic here or in service
    return {
      revenue: 1250000,
      bookings: 24,
      visitors: 1450,
      conversion: 4.2,
    };
  }
}
