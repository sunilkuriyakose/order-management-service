import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../database/schemas/order.schema';

@Injectable()
export class OrderNumberUtil {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async generateOrderNo(): Promise<string> {
    const lastOrder = await this.orderModel
      .findOne()
      .sort({ orderNo: -1 })
      .select('orderNo')
      .exec();

    let nextNumber = 2501100; // Default starting number

    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNo.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    return `AE-A-${nextNumber}`;
  }
}
