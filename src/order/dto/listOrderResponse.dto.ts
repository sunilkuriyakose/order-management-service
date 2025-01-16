import { Expose } from 'class-transformer';
import { OrderBasicInfoDTO } from './orderBasicInfo.dto';

export class ListOrderResponseDTO {
  @Expose()
  orderList: OrderBasicInfoDTO[];

  @Expose()
  totalCount: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;
}
