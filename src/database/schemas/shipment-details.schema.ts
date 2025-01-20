import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ShipmentDetails {
  @Prop({ required: true })
  id: number;

  @Prop({ type: Types.ObjectId, required: true })
  order_id: Types.ObjectId;

  @Prop({ required: true })
  order_no: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true, default: 0 })
  delivered_quantity: number;

  @Prop({ required: true, default: 'Not Assigned' })
  delivered_by: string;

  @Prop({ required: true, default: Date.now })
  delivered_date: Date;

  @Prop({ required: true })
  total_price: number;

  @Prop({ required: true })
  grand_total: number;
}

export const ShipmentDetailsSchema =
  SchemaFactory.createForClass(ShipmentDetails);
