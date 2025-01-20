import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class StoreInfoDto {
  @IsNumber()
  id: number;

  @IsNumber()
  dealer_id: number;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsNotEmpty()
  dealer_type: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @Type(() => Date)
  @IsDate()
  created_date: Date;

  @Type(() => Date)
  @IsDate()
  updated_date: Date;
}
