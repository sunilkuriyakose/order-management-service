import { Expose } from 'class-transformer';

export class OrderBasicInfoDTO {
  @Expose()
  id: string;
  @Expose()
  orderNo: string;
  @Expose()
  orderValue: number;
  @Expose()
  quantity: number;
  @Expose()
  businessName: string;
  @Expose()
  status: string;
  @Expose()
  date: Date;
}
