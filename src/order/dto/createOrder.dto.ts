import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class ProductDetailsDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  quantity: number;

  @IsString()
  vat_percent: string;

  @IsNumber()
  vat: number;

  @IsNumber()
  total_price: number;

  @IsNumber()
  grand_total: number;
}

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  orderNo?: string;

  @IsNumber()
  orderValue: number;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailsDto)
  product_details: ProductDetailsDto[];
}
