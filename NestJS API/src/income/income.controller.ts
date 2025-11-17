import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { GetIncomesQueryDto } from './dto/query-income.dto';

@UseGuards(JwtAuthGuard)
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(
    @Body() createIncomeDto: CreateIncomeDto,
    @GetUser('id') userId: number,
  ) {
    return this.incomeService.create(createIncomeDto, userId);
  }

  @Delete(':id')
  deleteIncomeById(
    @Param('id', ParseIntPipe) incomeId: number,
    @GetUser('id') userId: number,
  ) {
    return this.incomeService.deleteIncomeById(incomeId, userId);
  }

  @Get()
  getAllIncomes(
    @GetUser('id') userId: number,
    @Query() query: GetIncomesQueryDto,
  ) {
    return this.incomeService.getAllIncomes(userId, query);
  }
}
