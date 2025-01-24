import { Injectable, Logger, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import mongoose, { Model } from 'mongoose';
import { Order } from '../database/schemas/order.schema';
import { ListOrderResponseDTO } from './dto/listOrderResponse.dto';
import { ListOrderFilter } from './types/list-order-filter.interface';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderRepository } from './repository/order.repository';
import { OrderMapper } from '../util/mapper/order.mapper';
import { ProductDetails } from '../database/schemas/product-details.schema';
import { OrderNumberUtil } from '../util/order-number.util';
import { ShipmentDetails } from '../database/schemas/shipment-details.schema';

@Injectable()
export class OrderService {
  private readonly BATCH_SIZE = 100; // Process in smaller chunks

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(ProductDetails.name)
    private productDetailsModel: Model<ProductDetails>,
    @InjectModel(ShipmentDetails.name)
    private shipmentDetailsModel: Model<ShipmentDetails>,
    private readonly orderRepository: OrderRepository,
    private readonly orderNumberUtil: OrderNumberUtil,
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

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new HttpException(
        'Order with the provided id is not available',
        404,
      );
    }

    return order;
  }

  async getAllOrdersWithSearchCriteria(
    filter: ListOrderFilter,
  ): Promise<ListOrderResponseDTO> {
    const mongoFilter = this.orderRepository.buildFilter(filter);
    const [entities, totalCount] = await Promise.all([
      this.orderRepository.find({
        ...mongoFilter,
        page: filter.page ?? 1,
        limit: filter.limit ?? 10,
        sortColumn: filter.sortColumn ?? 'date',
        sortOrder: filter.sortOrder ?? 'DESC',
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
    const orderNo = await this.orderNumberUtil.generateOrderNo();

    if (!createOrderDto.product_details?.length) {
      throw new Error('Order must have at least one product');
    }

    const orderEntity = OrderMapper.toEntity({
      ...createOrderDto,
      orderNo,
    });

    const result = await this.orderRepository.create(orderEntity);

    if (createOrderDto.product_details?.length) {
      // Process product details in batches
      const batches = [];
      for (
        let i = 0;
        i < createOrderDto.product_details.length;
        i += this.BATCH_SIZE
      ) {
        const batch = createOrderDto.product_details
          .slice(i, i + this.BATCH_SIZE)
          .map((product, index) => ({
            ...product,
            id: i + index + 1,
            order_id: result._id,
          }));
        batches.push(batch);
      }

      // Insert batches sequentially
      const productDetails = [];
      for (const batch of batches) {
        const details = await this.productDetailsModel.insertMany(batch, {
          lean: true,
        });
        productDetails.push(...details);
      }

      // Update order with minimal memory usage
      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          result._id,
          {
            $push: {
              product_details: { $each: productDetails.map((pd) => pd._id) },
            },
            $set: {
              shipment_details: [
                {
                  id: 1,
                  order_id: result._id,
                  order_no: orderNo,
                  status: 'Requested',
                  delivered_quantity: 0,
                  delivered_by: 'Not Assigned',
                  delivered_date: new Date(),
                  total_price: result.orderValue,
                  grand_total: result.orderValue,
                },
              ],
            },
          },
          { new: true, lean: true },
        )
        .select('_id orderNo orderValue quantity businessName status date')
        .populate('product_details', '-__v', null, { lean: true })
        .populate('shipment_details', '-__v', null, { lean: true });

      return OrderMapper.toBasicInfoDTO(updatedOrder);
    }

    return OrderMapper.toBasicInfoDTO(result);
  }
}
