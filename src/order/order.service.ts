import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import mongoose, { Model } from 'mongoose';
import { Order } from 'src/database/schemas/order.schema';
import { OrderBasicInfoDTO } from './dto/orderBasicInfo.dto';
import { ListOrderResponseDTO } from './dto/listOrderResponse.dto';
import { APIFeatures } from 'src/util/apiFeatures';
import { ListOrderFilter } from './types/list-order-filter.interface';
import { CreateOrderDto } from './dto/createOrder.dto';
// import { mapDtoToEntity } from 'src/util/mapper/order.mapper';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll(): Promise<Order[]> {
    Logger.log('This action returns all Orders');
    return this.orderModel.find();
  }

  async findById(id: string): Promise<Order> {
    Logger.log('This action returns the order with the provided id');
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException(
        'Order with the provided id is not available',
        404,
      );
    }
    return await this.orderModel.findById(id).exec();
  }

  async getOrderInfo(orderNo: string): Promise<Order> {
    Logger.log(
      'This action returns the order with the provided search Criteria',
    );
    const order = await this.orderModel.findOne({ orderNo: orderNo }).exec();
    if (!order) {
      Logger.log('Order with Order No:${orderNo} is not available');
      throw new NotFoundException(
        `Order with Order No:${orderNo} is not available`,
      );
    }
    return new this.orderModel({
      id: order._id,
      orderNo: order.orderNo,
      businessName: order.businessName,
      status: order.status,
      orderValue: order.orderValue,
      quantity: order.quantity,
    });
  }

  async getAllOrdersWithSearchCriteria(
    filter: ListOrderFilter,
  ): Promise<ListOrderResponseDTO> {
    const features = new APIFeatures(this.orderModel.find(), filter).filter();
    const skipCount = (filter.page - 1) * filter.limit;
    console.log(features);
    const totalCount = await this.orderModel.countDocuments(features).exec();
    const entities = await this.orderModel
      .find(features)
      .limit(filter.limit)
      .skip(skipCount)
      .exec();
    return plainToInstance(ListOrderResponseDTO, {
      orderList: plainToInstance(OrderBasicInfoDTO, entities, {
        excludeExtraneousValues: true,
      }),
      totalCount: totalCount,
      page: filter.page,
      limit: filter.limit,
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const newOrder = new this.orderModel(createOrderDto);
    const result = await newOrder.save();
    return plainToInstance(OrderBasicInfoDTO, result, {
      excludeExtraneousValues: true,
    });
  }

  //   async getAllOrderWithFilter(query?: any): Promise<ListOrderResponseDTO> {
  //     const features = new APIFeatures(this.orderModel.find(), query)
  //       .filter()
  //       .sort()
  //       .limit()
  //       .pagination();
  //     //Execute the query
  //     const orders = await features.mongooseQuery;

  //     return orders;
  //   }
}
