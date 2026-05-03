import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, PaymentStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getOperatorByUserId(userId: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { userId },
    });
    if (!operator) throw new NotFoundException('Profil opérateur introuvable');
    return operator;
  }

  /**
   * Crée une intention d'abonnement pour un opérateur (statut UNPAID par défaut)
   */
  async subscribe(operatorId: string, plan: SubscriptionPlan, months: number = 1) {
    const operator = await this.prisma.operator.findUnique({
      where: { id: operatorId },
    });

    if (!operator) {
      throw new NotFoundException('Opérateur introuvable');
    }

    const amountMap = {
      [SubscriptionPlan.STARTER]: 15000,
      [SubscriptionPlan.PROFESSIONAL]: 45000,
      [SubscriptionPlan.PREMIUM]: 120000,
    };

    const amount = amountMap[plan] * months;
    
    // On ne calcule pas encore la date de fin réelle, on le fera à la confirmation du paiement
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    return this.prisma.subscription.create({
      data: {
        operatorId,
        plan,
        amount,
        startDate,
        endDate,
        isActive: false, // Inactif jusqu'au paiement
        paymentStatus: PaymentStatus.UNPAID,
      },
    });
  }

  /**
   * Confirme le paiement et active l'abonnement
   */
  async confirmPayment(subscriptionId: string, method: string, reference: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Abonnement introuvable');
    }

    if (subscription.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Cet abonnement est déjà payé');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Marquer l'abonnement comme payé et actif
      const updatedSub = await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          isActive: true,
          mobileMoneyRef: method.includes('MOBILE') ? reference : undefined,
          stripeSubId: method === 'STRIPE' ? reference : undefined,
        },
      });

      // 2. Mettre à jour le profil de l'opérateur avec la nouvelle date d'expiration
      await tx.operator.update({
        where: { id: subscription.operatorId },
        data: {
          subscriptionPlan: subscription.plan,
          subscriptionEnd: subscription.endDate,
        },
      });

      return updatedSub;
    });
  }

  /**
   * Récupère les données pour générer une facture
   */
  async getInvoice(subscriptionId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        operator: {
          include: { user: true }
        }
      }
    });

    if (!sub) throw new NotFoundException('Facture introuvable');

    return {
      invoiceNumber: `INV-${sub.id.substring(0, 8).toUpperCase()}`,
      date: sub.createdAt,
      operator: sub.operator.businessName,
      address: sub.operator.address,
      taxId: sub.operator.taxId,
      plan: sub.plan,
      amount: sub.amount,
      currency: sub.currency,
      status: sub.paymentStatus,
      period: {
        start: sub.startDate,
        end: sub.endDate
      }
    };
  }

  /**
   * Vérifie si un opérateur a un abonnement valide
   */
  async checkSubscriptionStatus(operatorId: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { id: operatorId },
      select: { subscriptionEnd: true, subscriptionPlan: true },
    });

    if (!operator) return { isActive: false, plan: null };

    const now = new Date();
    const isActive = operator.subscriptionEnd ? operator.subscriptionEnd > now : false;

    return {
      isActive,
      plan: operator.subscriptionPlan,
      expiryDate: operator.subscriptionEnd,
    };
  }

  /**
   * Liste les abonnements d'un opérateur
   */
  async getOperatorSubscriptions(operatorId: string) {
    return this.prisma.subscription.findMany({
      where: { operatorId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
