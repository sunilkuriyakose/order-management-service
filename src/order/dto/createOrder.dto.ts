import { Type } from 'class-transformer';
import { IsNumber, Min, IsString, IsIn, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  orderNo: string;
  @IsNotEmpty()
  @IsString()
  businessName: string;
  @IsNotEmpty()
  @IsString()
  @IsIn(['In Progress', 'Delivered', 'Cancelled'])
  status: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number = 1;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  orderValue: number;
}
