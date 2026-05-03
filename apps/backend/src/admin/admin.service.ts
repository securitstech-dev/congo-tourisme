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

  async getFinancialSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Prix des plans en FCFA
    const PLAN_PRICES: Record<string, number> = {
      STARTER: 15000,
      PROFESSIONAL: 45000,
      PREMIUM: 120000,
    };

    // Opérateurs avec abonnement actif
    const activeOperators = await this.prisma.operator.findMany({
      where: {
        isValidated: true,
        subscriptionEnd: { gte: now },
      },
      select: {
        id: true,
        businessName: true,
        subscriptionPlan: true,
        subscriptionEnd: true,
        city: true,
        user: { select: { email: true } },
      },
    });

    // Opérateurs expirés
    const expiredCount = await this.prisma.operator.count({
      where: {
        isValidated: true,
        subscriptionEnd: { lt: now },
      },
    });

    // MRR calculé depuis les abonnements actifs
    const mrr = activeOperators.reduce((sum, op) => {
      return sum + (PLAN_PRICES[op.subscriptionPlan || 'STARTER'] || 0);
    }, 0);

    // ARR projeté
    const arr = mrr * 12;

    // Répartition par plan
    const planBreakdown = Object.keys(PLAN_PRICES).map((plan) => ({
      plan,
      count: activeOperators.filter((o) => o.subscriptionPlan === plan).length,
      revenue: activeOperators
        .filter((o) => o.subscriptionPlan === plan)
        .reduce((s) => s + PLAN_PRICES[plan], 0),
    }));

    // Revenus mensuels sur les 12 derniers mois (simulés depuis subscriptions actives)
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return {
        month: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
      };
    });

    const revenueByMonth = await Promise.all(
      last12Months.map(async (m) => {
        const start = new Date(m.year, m.monthNum, 1);
        const end = new Date(m.year, m.monthNum + 1, 0, 23, 59, 59);

        const active = await this.prisma.operator.count({
          where: {
            isValidated: true,
            validatedAt: { lte: end },
            subscriptionEnd: { gte: start },
          },
        });

        // Estimation revenue basée sur le nombre d'actifs × prix moyen
        const avgPrice = activeOperators.length > 0 ? mrr / activeOperators.length : 0;
        return {
          month: m.month,
          revenue: Math.round(active * avgPrice),
          operators: active,
        };
      })
    );

    // Abonnements récents (nouveaux ce mois-ci)
    const newThisMonth = await this.prisma.operator.findMany({
      where: {
        isValidated: true,
        validatedAt: { gte: startOfMonth },
      },
      select: {
        businessName: true,
        subscriptionPlan: true,
        city: true,
        validatedAt: true,
        user: { select: { email: true } },
      },
      orderBy: { validatedAt: 'desc' },
      take: 10,
    });

    return {
      mrr,
      arr,
      activeCount: activeOperators.length,
      expiredCount,
      planBreakdown,
      revenueByMonth,
      newThisMonth,
      activeOperators,
    };
  }

  async createManualRegistration(data: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Un compte avec cet email existe déjà.');
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'OPERATOR',
        passwordHash: 'MANUAL_REGISTRATION_PENDING', 
        isActive: true,
      },
    });

    const operator = await this.prisma.operator.create({
      data: {
        userId: user.id,
        businessName: data.businessName,
        businessType: data.businessType,
        description: "Enregistrement manuel au guichet",
        region: data.region,
        city: data.city,
        address: data.address,
        phone: data.businessPhone || data.phone,
        rccmNumber: data.rccmNumber,
        taxId: data.taxId,
        isValidated: false, 
        subscriptionPlan: data.subscriptionPlan || 'STARTER',
      },
    });

    return { user, operator };
  }
}
