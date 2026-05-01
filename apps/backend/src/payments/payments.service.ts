import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MtnMomoProvider } from './providers/mtn-momo.provider';
import { PaymentMethod, ReservationStatus, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

import { MailService } from '../common/mail/mail.service';

@Injectable()
export class PaymentsService {
  private stripe: any;

  constructor(
    private prisma: PrismaService,
    private mtnMomo: MtnMomoProvider,
    private configService: ConfigService,
    private mailService: MailService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

  async createStripePaymentIntent(reservationId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { listing: true },
    });

    if (!reservation) throw new NotFoundException('Réservation introuvable');

    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(reservation.totalPrice),
        currency: 'xaf',
        metadata: { reservationId },
      });

      await this.prisma.reservation.update({
        where: { id: reservationId },
        data: { stripePaymentId: intent.id },
      });

      return {
        clientSecret: intent.client_secret,
        amount: reservation.totalPrice,
      };
    } catch {
      throw new InternalServerErrorException('Erreur lors de la création de l\'intention de paiement');
    }
  }

  async handleStripeWebhook(payload: any, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch {
      throw new InternalServerErrorException('Webhook Signature Verification Failed');
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as any;
      const reservationId = intent.metadata.reservationId;

      const reservation = await this.prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { listing: true, tourist: true },
      });

      if (reservation) {
        await this.prisma.payment.create({
          data: {
            reservationId,
            amount: intent.amount,
            currency: intent.currency.toUpperCase(),
            method: PaymentMethod.STRIPE,
            stripePaymentId: intent.id,
            status: 'PAID',
            paidAt: new Date(),
          },
        });

        await this.prisma.reservation.update({
          where: { id: reservationId },
          data: {
            paymentStatus: PaymentStatus.PAID,
            status: ReservationStatus.CONFIRMED,
          },
        });

        await this.mailService.sendBookingConfirmation(
          reservation.tourist.email,
          reservation.id,
          reservation.listing.title,
          reservation.totalPrice
        );
      }
    }

    return { received: true };
  }

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
      const payment = await this.prisma.payment.findFirst({
        where: { mobileMoneyRef: transactionId },
      });

      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        });

        await this.prisma.reservation.update({
          where: { id: payment.reservationId },
          data: { paymentStatus: PaymentStatus.PAID, status: ReservationStatus.CONFIRMED },
        });
      }
    }

    return response;
  }
}
