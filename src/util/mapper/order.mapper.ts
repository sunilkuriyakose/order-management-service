import { CreateOrderDto } from '../../order/dto/createOrder.dto';
import { Order } from 'src/database/schemas/order.schema';
import { ListOrderRequestDTO } from 'src/order/dto/listOrderRequest.dto';
import { ListOrderFilter } from 'src/order/types/list-order-filter.interface';
import { plainToInstance } from 'class-transformer';
import { OrderBasicInfoDTO } from '../../order/dto/orderBasicInfo.dto';

export class OrderMapper {
  static toEntity(dto: CreateOrderDto): Partial<Order> {
    return {
      orderNo: dto.orderNo,
      businessName: dto.businessName,
      orderValue: dto.orderValue,
      quantity: dto.quantity,
      status: dto.status,
    };
  }

  static toFilter(dto: ListOrderRequestDTO): ListOrderFilter {
    return {
      ...dto,
    };
  }

  static toBasicInfoDTO(entity: Order): OrderBasicInfoDTO {
    return plainToInstance(OrderBasicInfoDTO, entity, {
      excludeExtraneousValues: true,
    });
  }
}
