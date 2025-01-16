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
// import { APIFeatures } from 'src/util/apiFeatures';
import { ListOrderFilter } from './types/list-order-filter.interface';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderRepository } from './repository/order.repository';
// import { mapDtoToEntity } from 'src/util/mapper/order.mapper';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly orderRepository: OrderRepository,
  ) {}

  async findAll(): Promise<Order[]> {
    Logger.log('This action returns all Orders');
    return this.orderRepository.findAll();
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
    return await this.orderRepository.findById(id);
  }

  async getOrderInfo(orderNo: string): Promise<Order> {
    Logger.log(
      'This action returns the order with the provided search Criteria',
    );
    const order = await this.orderRepository.find({ orderNo: orderNo });
    if (!order) {
      Logger.log('Order with Order No:${orderNo} is not available');
      throw new NotFoundException(
        `Order with Order No:${orderNo} is not available`,
      );
    }
    return new Order({
      id: order[0]._id,
      orderNo: order[0].orderNo,
      businessName: order[0].businessName,
      status: order[0].status,
      orderValue: order[0].orderValue,
      quantity: order[0].quantity,
    });
  }

  async getAllOrdersWithSearchCriteria(
    filter: ListOrderFilter,
  ): Promise<ListOrderResponseDTO> {
    const sort = {};
    sort[filter.sortColumn] = filter.sortOrder === 'DESC' ? -1 : 1;
    const entities = await this.orderRepository.find(filter);
    const totalCount = entities.length;
    return plainToInstance(ListOrderResponseDTO, {
      orderList: plainToInstance(OrderBasicInfoDTO, entities, {
        excludeExtraneousValues: true,
      }),
      totalCount: totalCount,
      page: filter.page || 1,
      limit: filter.limit || 10,
      sortColumn: filter.sortColumn || 'date',
      sortOrder: filter.sortOrder || 'DESC',
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const newOrder = new this.orderModel(createOrderDto);
    const result = await newOrder.save();
    return plainToInstance(OrderBasicInfoDTO, result, {
      excludeExtraneousValues: true,
    });
  }
}
