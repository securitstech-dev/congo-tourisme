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
    let operator = await this.operatorsService.findByUserId(userId);
    
    // Si l'utilisateur n'est pas encore enregistr comme oprateur dans la table Operator
    if (!operator) {
      operator = await this.operatorsService.create({
        userId,
        businessName: 'Nouvel Établissement', // Valeur par dfaut  changer plus tard
        businessType: 'OTHER',
      });
    }

    return this.prisma.listing.create({
      data: {
        ...createListingDto,
        operatorId: operator.id,
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
          include: { user: true },
        },
      },
    });

    if (!listing) throw new NotFoundException('Annonce introuvable');
    return listing;
  }
}
