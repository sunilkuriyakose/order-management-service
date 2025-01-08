import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [OrderModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
