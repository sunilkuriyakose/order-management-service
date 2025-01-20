import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class StoreInfo {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  dealer_id: number;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  area: string;

  @Prop({ required: true })
  dealer_type: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  created_date: Date;

  @Prop({ required: true })
  updated_date: Date;
}

export const StoreInfoSchema = SchemaFactory.createForClass(StoreInfo);
