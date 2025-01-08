import { DateFilterDto } from '../../dto/date-filter.dto';

export interface ListOrderFilter {
  businessName?: string;
  orderNo?: string;
  status?: string;
  quantity?: number;
  date?: DateFilterDto;
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortColumn?: string;
}
