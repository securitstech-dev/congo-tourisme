import { Body, Controller, Post, UseGuards, Get, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('mobile-money')
  initiate(@Body('reservationId') reservationId: string, @Body('phone') phone: string) {
    return this.paymentsService.initiateMobilePayment(reservationId, phone);
  }

  @Get('verify')
  verify(@Query('transactionId') transactionId: string) {
    return this.paymentsService.verifyPayment(transactionId);
  }
}
