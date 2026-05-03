import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, PaymentStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée ou renouvelle un abonnement pour un opérateur
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
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    return this.prisma.$transaction(async (tx) => {
      // 1. Créer l'enregistrement d'abonnement
      const subscription = await tx.subscription.create({
        data: {
          operatorId,
          plan,
          amount,
          startDate,
          endDate,
          isActive: true,
        },
      });

      // 2. Mettre à jour le profil de l'opérateur
      await tx.operator.update({
        where: { id: operatorId },
        data: {
          subscriptionPlan: plan,
          subscriptionEnd: endDate,
        },
      });

      return subscription;
    });
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
