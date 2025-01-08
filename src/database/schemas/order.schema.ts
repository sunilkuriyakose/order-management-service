/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  orderNo: string;

  @Prop()
  orderValue: number;

  @Prop()
  quantity: number;

  @Prop()
  status: string;

  @Prop()
  businessName: string;
  @Prop({
    type: Date,
    default: Date.now,
  })
  date: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
