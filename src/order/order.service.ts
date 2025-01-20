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
import { ProductDetails } from 'src/database/schemas/product-details.schema';
import { OrderNumberUtil } from 'src/util/order-number.util';
import { ShipmentDetails } from 'src/database/schemas/shipment-details.schema';

@Injectable()
export class OrderService {
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
    const orderNo = await this.orderNumberUtil.generateOrderNo();
    const orderEntity = OrderMapper.toEntity({
      ...createOrderDto,
      orderNo,
    });
    const result = await this.orderRepository.create(orderEntity);

    // Create product details
    if (createOrderDto.product_details?.length) {
      const savedProductDetails = [];
      for (let i = 0; i < createOrderDto.product_details.length; i++) {
        const product = createOrderDto.product_details[i];
        const productDetail = await this.productDetailsModel.create({
          ...product,
          id: i + 1,
          order_id: result._id,
        });
        savedProductDetails.push(productDetail);
      }

      // Create shipment details
      const shipmentDetail = await this.shipmentDetailsModel.create({
        id: 1, // First shipment for the order
        order_id: result._id,
        order_no: orderNo,
        status: 'Requested',
        delivered_quantity: 0,
        delivered_by: 'Not Assigned',
        delivered_date: new Date(),
        total_price: result.orderValue,
        grand_total: result.orderValue,
      });

      // Update order with both product and shipment details
      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          result._id,
          {
            $push: {
              product_details: { $each: savedProductDetails },
            },
            $set: {
              shipment_details: [shipmentDetail],
            },
          },
          { new: true },
        )
        .populate('product_details')
        .populate('shipment_details');

      return OrderMapper.toBasicInfoDTO(updatedOrder);
    }

    return OrderMapper.toBasicInfoDTO(result);
  }
}
