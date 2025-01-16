import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/database/schemas/order.schema';
import { ListOrderRequestDTO } from './dto/listOrderRequest.dto';
import { ListOrderResponseDTO } from './dto/listOrderResponse.dto';
import { ResponseDTO } from 'src/dto/response.dto';
import { ResponseUtil } from 'src/util/response.util';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderBasicInfoDTO } from './dto/orderBasicInfo.dto';
import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';

@Controller('/Order')
@UseInterceptors(LoggingInterceptor)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Get('getAllOrders')
  getOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get('getOrderById:id')
  async findById(@Param('id') id: string) {
    return await this.orderService.findById(id);
  }

  @Get('getAllOrdersBySearchCriteria')
  async getOrderList(
    @Query(ValidationPipe) requestDTO: ListOrderRequestDTO,
  ): Promise<ResponseDTO<ListOrderResponseDTO>> {
    const responseDTO =
      await this.orderService.getAllOrdersWithSearchCriteria(requestDTO);
    return this.responseUtil.successResponse(0, responseDTO);
  }

  @Post('createOrder')
  @MessagePattern('createOrder')
  @ApiResponse({
    status: 201,
    description: 'Order has been successfully placed.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: Order,
    description: 'Json structure for order object',
  })
  async createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ): Promise<ResponseDTO<OrderBasicInfoDTO>> {
    const responseDTO = await this.orderService.createOrder(createOrderDto);
    return this.responseUtil.successResponse(0, responseDTO);
  }
}
