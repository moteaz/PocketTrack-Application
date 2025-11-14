import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  async create(createIncomeDto: CreateIncomeDto, userId: number) {
    if (!createIncomeDto.icon) {
      createIncomeDto.icon = '💰';
      return this.prisma.income.create({
        data: {
          ...createIncomeDto,
          userId: userId,
        },
      });
    }
  }
}
