import { CreateOrderDto } from '../../order/dto/createOrder.dto';
import { Order } from 'src/database/schemas/order.schema';
import { ListOrderRequestDTO } from 'src/order/dto/listOrderRequest.dto';
import { ListOrderFilter } from 'src/order/types/list-order-filter.interface';
import { plainToInstance } from 'class-transformer';
import { OrderBasicInfoDTO } from 'src/order/dto/orderBasicInfo.dto';

export class OrderMapper {
  static toEntity(dto: CreateOrderDto): Order {
    const order = new Order();
    order.orderNo = dto.orderNo;
    order.businessName = dto.businessName;
    order.orderValue = dto.orderValue;
    order.quantity = dto.quantity;
    order.status = dto.status;
    return order;
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
