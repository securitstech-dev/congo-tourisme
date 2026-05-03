import { Controller, Get, UseGuards, Req, Body, Patch } from '@nestjs/common';
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
    return this.operatorsService.getStats(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Req() req, @Body() data: any) {
    const operator = await this.operatorsService.findByUserId(req.user.id);
    return this.operatorsService.update(operator.id, data);
  }
}
