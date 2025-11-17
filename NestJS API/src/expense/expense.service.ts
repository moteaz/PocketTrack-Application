import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { GetExpenseQueryDto } from './dto/query-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto, userId: number) {
    const data = {
      ...createExpenseDto,
      icon: createExpenseDto.icon ?? '💰', // default icon if missing
      userId,
    };
    return this.prisma.expense.create({
      data,
    });
  }

  async deleteExpenseById(expenseId: number, userId: number) {
    try {
      return await this.prisma.expense.delete({
        where: {
          id: expenseId,
          userId: userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          'Expense not found or you do not have permission to delete it',
        );
      }
      throw error;
    }
  }

  async getAllExpenses(userId: number, query: GetExpenseQueryDto) {
    const { page = 1, limit = 10, startDate, endDate } = query;

    const where = {
      userId,
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const [data, total, totalAmountExpenses] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.expense.count({ where }),
      this.prisma.expense.aggregate({
        where,
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalAmount: totalAmountExpenses._sum.amount || 0,
      },
    };
  }
}
