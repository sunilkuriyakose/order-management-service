import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from '../database/database.module';
import { OrderRepository } from './repository/order.repository';
import { ResponseUtil } from 'src/util/response.util';
import { OrderNumberUtil } from 'src/util/order-number.util';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ResponseUtil, OrderNumberUtil],
})
export class OrderModule {}
