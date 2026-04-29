import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MtnMomoProvider } from './providers/mtn-momo.provider';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private mtnMomo: MtnMomoProvider,
  ) {}

  async initiateMobilePayment(reservationId: string, phoneNumber: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { listing: true },
    });

    if (!reservation) throw new NotFoundException('Réservation introuvable');

    const response = await this.mtnMomo.processPayment(
      reservation.totalPrice,
      phoneNumber,
      `Paiement pour ${reservation.listing.title}`
    );

    if (response.success) {
      await this.prisma.payment.create({
        data: {
          reservationId,
          amount: reservation.totalPrice,
          currency: 'XAF',
          method: PaymentMethod.MOBILE_MONEY_MTN,
          mobileMoneyRef: response.transactionId,
          status: response.status,
        },
      });
    }

    return response;
  }

  async verifyPayment(transactionId: string) {
    const response = await this.mtnMomo.checkStatus(transactionId);
    
    if (response.status === 'SUCCESS') {
      const payment = await this.prisma.payment.update({
        where: { mobileMoneyRef: transactionId },
        data: { 
          status: 'PAID',
          paidAt: new Date()
        },
      });

      await this.prisma.reservation.update({
        where: { id: payment.reservationId },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      });
    }

    return response;
  }
}
