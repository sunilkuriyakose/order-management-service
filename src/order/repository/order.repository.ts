import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Repository } from '../../common/repository';
import { Order } from '../../database/schemas/order.schema';
import { ListOrderFilter } from '../types/list-order-filter.interface';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {
    super(orderModel);
  }

  buildFilter(filter: ListOrderFilter): FilterQuery<Order> {
    const query: FilterQuery<Order> = {};

    if (filter.orderNo) {
      query.orderNo = { $regex: filter.orderNo, $options: 'i' };
    }
    if (filter.businessName) {
      query.businessName = { $regex: filter.businessName, $options: 'i' };
    }
    if (filter.status) {
      query.status = {
        $in: Array.isArray(filter.status) ? filter.status : [filter.status],
      };
    }
    if (filter.quantity) {
      query.quantity = filter.quantity;
    }
    if (filter.orderValue) {
      query.orderValue = filter.orderValue;
    }

    return query;
  }

  async findById(id: string): Promise<Order> {
    return this.orderModel
      .findById(id)
      .populate('product_details')
      .populate('shipment_details')
      .populate('store_info')
      .exec();
  }
}
