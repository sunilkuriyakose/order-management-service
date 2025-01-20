import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ShipmentDetailsDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  order_no: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  delivered_quantity: number;

  @IsString()
  @IsNotEmpty()
  delivered_by: string;

  @Type(() => Date)
  @IsDate()
  delivered_date: Date;

  @IsNumber()
  total_price: number;

  @IsNumber()
  grand_total: number;
}
