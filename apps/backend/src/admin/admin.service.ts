import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../common/mail/mail.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async getPendingOperators() {
    return this.prisma.operator.findMany({
      where: { isValidated: false },
      include: { 
        user: true,
        documents: true
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllOperators() {
    return this.prisma.operator.findMany({
      include: { user: true, listings: { select: { id: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async validateOperator(id: string) {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14 jours d'essai

    const operator = await this.prisma.operator.update({
      where: { id },
      data: { 
        isValidated: true, 
        validatedAt: new Date(),
        trialEndsAt,
        isTrialUsed: true,
        subscriptionPlan: 'STARTER' // Plan par défaut pour l'essai
      },
      include: { user: true }
    });

    // Envoyer l'email de confirmation
    if (operator.user?.email) {
      await this.mailService.sendOperatorValidationEmail(
        operator.user.email,
        operator.businessName,
        trialEndsAt
      );
    }

    return operator;
  }

  async updateDocumentStatus(docId: string, status: any, reason?: string) {
    return this.prisma.operatorDocument.update({
      where: { id: docId },
      data: { 
        status, 
        rejectionReason: reason 
      },
    });
  }

  async rejectOperator(id: string, reason: string = "Dossier incomplet ou non conforme.") {
    // Soft-delete via désactivation du compte utilisateur lié
    const operator = await this.prisma.operator.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!operator) throw new NotFoundException('Opérateur introuvable');

    await this.prisma.user.update({
      where: { id: operator.userId },
      data: { isActive: false },
    });

    // Envoyer l'email de rejet
    if (operator.user?.email) {
      await this.mailService.sendOperatorRejectionEmail(
        operator.user.email,
        operator.businessName,
        reason
      );
    }

    return { message: 'Opérateur rejeté et compte désactivé.' };
  }

  async getGlobalStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      operatorsCount,
      validatedOperators,
      listingsCount,
      bookingsCount,
      monthBookings,
      totalRevenue,
      monthRevenue,
      recentPayments,
    ] = await Promise.all([
      this.prisma.operator.count(),
      this.prisma.operator.count({ where: { isValidated: true } }),
      this.prisma.listing.count({ where: { deletedAt: null } }),
      this.prisma.reservation.count(),
      this.prisma.reservation.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID', paidAt: { gte: startOfMonth } },
      }),
      this.prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        where: { status: 'PAID' },
        include: {
          reservation: {
            include: {
              tourist: { select: { firstName: true, lastName: true, email: true } },
              listing: { select: { title: true } },
            },
          },
        },
      }),
    ]);

    return {
      operators: operatorsCount,
      validatedOperators,
      listings: listingsCount,
      bookings: bookingsCount,
      monthBookings,
      revenue: totalRevenue._sum?.amount || 0,
      monthRevenue: monthRevenue._sum?.amount || 0,
      recentPayments,
    };
  }
}
