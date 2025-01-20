import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ProductDetails {
  @Prop({ required: true })
  id: number;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order_id: Types.ObjectId;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  unit_price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  vat_percent: string;

  @Prop({ required: true })
  vat: number;

  @Prop({ required: true })
  total_price: number;

  @Prop({ required: true })
  grand_total: number;
}

export const ProductDetailsSchema =
  SchemaFactory.createForClass(ProductDetails);
