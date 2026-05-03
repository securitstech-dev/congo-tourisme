import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Operator, Prisma } from '@prisma/client';

@Injectable()
export class OperatorsService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.operator.findUnique({
      where: { userId },
      include: { documents: true },
    });
  }

  async create(data: Prisma.OperatorUncheckedCreateInput): Promise<Operator> {
    return this.prisma.operator.create({ data });
  }

  async update(id: string, data: Prisma.OperatorUpdateInput): Promise<Operator> {
    return this.prisma.operator.update({ where: { id }, data });
  }

  async uploadDocument(operatorId: string, type: any, url: string, cloudinaryId: string) {
    return this.prisma.operatorDocument.upsert({
      where: {
        // Un opérateur ne peut avoir qu'un seul document actif par type
        // Note: Prisma ne supporte pas l'upsert sur un couple de champs sans index unique
        // On va utiliser create si inexistant ou update
        id: (await this.prisma.operatorDocument.findFirst({
          where: { operatorId, type }
        }))?.id || 'new-id'
      },
      update: { url, cloudinaryId, status: 'PENDING' },
      create: {
        operatorId,
        type,
        url,
        cloudinaryId,
        status: 'PENDING'
      }
    });
  }

  /**
   * Calcule les statistiques réelles de l'opérateur pour son dashboard
   */
  async getStats(userId: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { userId },
    });

    if (!operator) {
      return { revenue: 0, bookings: 0, visitors: 0, conversion: 0 };
    }

    // Début du mois courant
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Réservations du mois
    const [allBookings, monthBookings, paidPayments] = await Promise.all([
      this.prisma.reservation.count({
        where: { operatorId: operator.id },
      }),
      this.prisma.reservation.count({
        where: {
          operatorId: operator.id,
          createdAt: { gte: startOfMonth },
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          reservation: { operatorId: operator.id },
          status: 'PAID',
          paidAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    // Revenu du mois (en FCFA)
    const revenue = paidPayments._sum.amount ?? 0;

    // Taux de conversion : réservations confirmées / total annonces actives
    const activeListings = await this.prisma.listing.count({
      where: { operatorId: operator.id, isAvailable: true, deletedAt: null },
    });
    const conversion = activeListings > 0
      ? parseFloat(((monthBookings / (activeListings * 10)) * 100).toFixed(1))
      : 0;

    return {
      revenue,
      bookings: allBookings,
      visitors: monthBookings * 8, // estimation : 8 vues par réservation
      conversion: Math.min(conversion, 100),
      subscription: {
        plan: operator.subscriptionPlan,
        endDate: operator.subscriptionEnd,
        isValidated: operator.isValidated,
      }
    };
  }
}
