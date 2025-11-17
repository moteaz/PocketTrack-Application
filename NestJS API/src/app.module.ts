import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { IncomeModule } from './income/income.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [AuthModule, IncomeModule, ExpenseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
