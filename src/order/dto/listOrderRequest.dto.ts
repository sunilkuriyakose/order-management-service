import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsIn } from 'class-validator';

export class ListOrderRequestDTO {
  @IsOptional()
  @IsString()
  orderNo?: string;
  @IsOptional()
  @IsString()
  businessName?: string;
  @IsOptional()
  @IsString({ each: true })
  @IsIn(['In Progress', 'Delivered', 'Cancelled'], { each: true })
  status?: string[];
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  orderValue?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
  @IsOptional()
  @IsString()
  sortColumn: string = 'date';
}
