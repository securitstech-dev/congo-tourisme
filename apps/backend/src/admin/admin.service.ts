import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPendingOperators() {
    return this.prisma.operator.findMany({
      where: { isValidated: false },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async validateOperator(id: string) {
    return this.prisma.operator.update({
      where: { id },
      data: { 
        isValidated: true,
        validatedAt: new Date(),
      },
    });
  }

  async getGlobalStats() {
    const [operatorsCount, listingsCount, bookingsCount, totalRevenue] = await Promise.all([
      this.prisma.operator.count(),
      this.prisma.listing.count(),
      this.prisma.reservation.count(),
      this.prisma.reservation.aggregate({
        _sum: { totalPrice: true },
        where: { paymentStatus: PaymentStatus.PAID }
      })
    ]);

    return {
      operators: operatorsCount,
      listings: listingsCount,
      bookings: bookingsCount,
      revenue: totalRevenue._sum?.totalPrice || 0,
    };
  }
}
