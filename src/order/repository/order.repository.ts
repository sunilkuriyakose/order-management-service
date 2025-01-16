import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../../common/repository';

import { Order } from '../../database/schemas/order.schema';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {
    super(orderModel);
  }
}
