import { Expose, Type } from 'class-transformer';

export class ProductDetailsBasicInfoDTO {
  @Expose()
  id: number;

  @Expose()
  sku: string;

  @Expose()
  unit_price: number;

  @Expose()
  quantity: number;

  @Expose()
  vat_percent: string;

  @Expose()
  vat: number;

  @Expose()
  total_price: number;

  @Expose()
  grand_total: number;
}

export class ShipmentDetailsBasicInfoDTO {
  @Expose()
  id: number;

  @Expose()
  order_id: string;

  @Expose()
  order_no: string;

  @Expose()
  status: string;

  @Expose()
  delivered_quantity: number;

  @Expose()
  delivered_by: string;

  @Expose()
  delivered_date: Date;

  @Expose()
  total_price: number;

  @Expose()
  grand_total: number;
}

export class StoreInfoBasicInfoDTO {
  @Expose()
  id: number;

  @Expose()
  dealer_id: number;

  @Expose()
  businessName: string;

  @Expose()
  region: string;

  @Expose()
  area: string;

  @Expose()
  dealer_type: string;

  @Expose()
  status: string;

  @Expose()
  created_date: Date;

  @Expose()
  updated_date: Date;
}

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

  @Expose()
  @Type(() => ProductDetailsBasicInfoDTO)
  product_details: ProductDetailsBasicInfoDTO[];

  @Expose()
  @Type(() => ShipmentDetailsBasicInfoDTO)
  shipment_details: ShipmentDetailsBasicInfoDTO[];

  @Expose()
  @Type(() => StoreInfoBasicInfoDTO)
  store_info: StoreInfoBasicInfoDTO;
}
