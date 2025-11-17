import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { GetExpenseQueryDto } from './dto/query-expense.dto';
@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @GetUser('id') userId: number,
  ) {
    return this.expenseService.create(createExpenseDto, userId);
  }

  @Get()
  getAllExpenses(
    @GetUser('id') userId: number,
    @Query() query: GetExpenseQueryDto,
  ) {
    return this.expenseService.getAllExpenses(userId, query);
  }

  @Delete(':id')
  deleteExpenseById(
    @Param('id', ParseIntPipe) expenseId: number,
    @GetUser('id') userId: number,
  ) {
    return this.expenseService.deleteExpenseById(expenseId, userId);
  }
}
