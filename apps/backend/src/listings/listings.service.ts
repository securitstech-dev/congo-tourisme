import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    const operator = await this.operatorsService.findByUserId(userId);
    
    if (!operator) {
      throw new ForbiddenException("Vous devez avoir un profil opérateur pour créer une annonce.");
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
      include: { images: true }
    });
  }

  async findAll(filters?: { 
    type?: string, 
    minPrice?: number, 
    maxPrice?: number, 
    rating?: number 
  }) {
    const where: any = { deletedAt: null };

    if (filters?.type) {
      // Mapping des types simplifiés du front vers les enums Prisma
      const typeMapping: any = {
        'HOTEL': 'HOTEL',
        'RESTAURANT': 'RESTAURANT',
        'NIGHTCLUB': 'BAR_NIGHTCLUB',
        'SITE': 'TOURIST_SITE',
      };
      
      const mappedType = typeMapping[filters.type] || filters.type;
      where.operator = { businessType: mappedType };
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.OR = [
        { pricePerNight: { gte: filters.minPrice, lte: filters.maxPrice } },
        { pricePerPerson: { gte: filters.minPrice, lte: filters.maxPrice } },
        { priceFlatRate: { gte: filters.minPrice, lte: filters.maxPrice } },
      ];
    }

    if (filters?.rating) {
      where.rating = { gte: filters.rating };
    }

    return this.prisma.listing.findMany({
      where,
      include: {
        images: true,
        operator: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByOperator(userId: string) {
    const operator = await this.operatorsService.findByUserId(userId);
    if (!operator) return [];

    return this.prisma.listing.findMany({
      where: { operatorId: operator.id, deletedAt: null },
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
        operator: true,
        reviews: {
          where: { isVisible: true },
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!listing || listing.deletedAt) throw new NotFoundException('Annonce introuvable');
    return listing;
  }

  async update(userId: string, id: string, data: any) {
    const operator = await this.operatorsService.findByUserId(userId);
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) throw new NotFoundException('Annonce introuvable');
    if (listing.operatorId !== operator?.id) throw new ForbiddenException("Action non autorisée.");

    const { images, ...updateData } = data;

    // Gestion des images si fournies
    if (images) {
      await this.prisma.listingImage.deleteMany({ where: { listingId: id } });
      updateData.images = {
        create: images.map(img => ({
          url: img.url,
          cloudinaryId: img.cloudinaryId,
        }))
      };
    }

    return this.prisma.listing.update({
      where: { id },
      data: updateData,
      include: { images: true }
    });
  }

  async remove(userId: string, id: string) {
    const operator = await this.operatorsService.findByUserId(userId);
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) throw new NotFoundException('Annonce introuvable');
    if (listing.operatorId !== operator?.id) throw new ForbiddenException("Action non autorisée.");

    // Soft delete
    return this.prisma.listing.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
