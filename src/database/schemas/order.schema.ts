/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { ProductDetails } from './product-details.schema';
import {
  ShipmentDetails,
  ShipmentDetailsSchema,
} from './shipment-details.schema';
import { StoreInfo, StoreInfoSchema } from './store-info.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  orderNo: string;

  @Prop({ required: true })
  orderValue: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  status: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProductDetails' }] })
  product_details: Types.ObjectId[] | ProductDetails[];

  @Prop({ type: [ShipmentDetailsSchema] })
  shipment_details: ShipmentDetails[];

  @Prop({ type: StoreInfoSchema })
  store_info: StoreInfo;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
