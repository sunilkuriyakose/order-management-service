import { Injectable, Logger, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import mongoose, { Model } from 'mongoose';
import { Order } from 'src/database/schemas/order.schema';
import { ListOrderResponseDTO } from './dto/listOrderResponse.dto';
import { ListOrderFilter } from './types/list-order-filter.interface';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderRepository } from './repository/order.repository';
import { OrderMapper } from 'src/util/mapper/order.mapper';

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

  async getAllOrdersWithSearchCriteria(
    filter: ListOrderFilter,
  ): Promise<ListOrderResponseDTO> {
    const mongoFilter = this.orderRepository.buildFilter(filter);
    const [entities, totalCount] = await Promise.all([
      this.orderRepository.find({
        ...mongoFilter,
        page: filter.page,
        limit: filter.limit,
        sortColumn: filter.sortColumn,
        sortOrder: filter.sortOrder,
      }),
      this.orderRepository.countDocuments(mongoFilter),
    ]);

    return plainToInstance(ListOrderResponseDTO, {
      orderList: entities.map((entity) => OrderMapper.toBasicInfoDTO(entity)),
      totalCount,
      page: filter.page ?? 1,
      limit: filter.limit ?? 10,
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const result = await this.orderRepository.create(createOrderDto);
    return OrderMapper.toBasicInfoDTO(result);
  }
}
