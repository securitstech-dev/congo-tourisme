import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Operator, Prisma } from '@prisma/client';

@Injectable()
export class OperatorsService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Operator | null> {
    return this.prisma.operator.findUnique({
      where: { userId },
    });
  }

  async create(data: Prisma.OperatorUncheckedCreateInput): Promise<Operator> {
    return this.prisma.operator.create({
      data,
    });
  }

  async update(id: string, data: Prisma.OperatorUpdateInput): Promise<Operator> {
    return this.prisma.operator.update({
      where: { id },
      data,
    });
  }
}
