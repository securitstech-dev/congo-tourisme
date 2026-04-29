import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: createBookingDto.listingId },
      include: { operator: true },
    });

    if (!listing) throw new NotFoundException('Annonce introuvable');

    return this.prisma.reservation.create({
      data: {
        touristId: userId,
        listingId: listing.id,
        operatorId: listing.operatorId,
        totalPrice: createBookingDto.totalAmount,
        checkIn: new Date(createBookingDto.startDate),
        checkOut: createBookingDto.endDate ? new Date(createBookingDto.endDate) : null,
        status: 'PENDING',
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.reservation.findMany({
      where: { touristId: userId },
      include: {
        listing: {
          include: { images: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOperator(userId: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { userId },
    });

    if (!operator) return [];

    return this.prisma.reservation.findMany({
      where: { operatorId: operator.id },
      include: {
        listing: true,
        tourist: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }
}
