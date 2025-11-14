import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { IncomeModule } from './income/income.module';

@Module({
  imports: [AuthModule, IncomeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
