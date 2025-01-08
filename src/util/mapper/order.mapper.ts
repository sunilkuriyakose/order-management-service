import { CreateOrderDto } from '../../order/dto/createOrder.dto';
import { Order } from 'src/database/schemas/order.schema';

export function mapDtoToEntity(dto: CreateOrderDto): Order {
  const order = new Order();
  order.orderNo = dto.orderNo;
  order.businessName = dto.businessName;
  order.orderValue = dto.orderValue;
  order.quantity = dto.quantity;
  order.status = dto.status;

  return order;
}
