import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { OperatorsService } from '../operators/operators.service';

@Injectable()
export class ListingsService {
  constructor(
    private prisma: PrismaService,
    private operatorsService: OperatorsService,
  ) {}

  async create(userId: string, createListingDto: CreateListingDto) {
    const { images, ...listingData } = createListingDto;
    let operator = await this.operatorsService.findByUserId(userId);
    
    if (!operator) {
      operator = await this.operatorsService.create({
        userId,
        businessName: 'Nouvel Établissement',
        businessType: 'OTHER',
        description: 'À renseigner',
        region: 'Pointe-Noire',
        city: 'Pointe-Noire',
        address: 'À renseigner',
        phone: '000000000',
      });
    }

    return this.prisma.listing.create({
      data: {
        ...listingData,
        operatorId: operator.id,
        images: images ? {
          create: images.map(img => ({
            url: img.url,
            cloudinaryId: img.cloudinaryId,
          }))
        } : undefined
      },
    });
  }

  async findAll() {
    return this.prisma.listing.findMany({
      include: {
        images: true,
        operator: true,
      },
    });
  }

  async findByOperator(userId: string) {
    const operator = await this.operatorsService.findByUserId(userId);
    if (!operator) return [];

    return this.prisma.listing.findMany({
      where: { operatorId: operator.id },
      include: {
        images: true,
      },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
        operator: true,
        reviews: {
          include: { author: true },
        },
      },
    });

    if (!listing) throw new NotFoundException('Annonce introuvable');
    return listing;
  }
}
