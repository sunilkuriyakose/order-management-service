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
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { OrderMapper } from 'src/util/mapper/order.mapper';

@ApiTags('Orders')
@Controller('/Order')
@UseInterceptors(LoggingInterceptor)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Get('getAllOrders')
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Retrieves a list of all orders in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders retrieved successfully',
    type: [Order],
  })
  getOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get('getOrderById:id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieves a specific order using its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Order found successfully',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findById(@Param('id') id: string) {
    return await this.orderService.findById(id);
  }

  @Get('getAllOrdersBySearchCriteria')
  @ApiOperation({
    summary: 'Search orders with filters',
    description:
      'Retrieves orders based on search criteria with pagination and sorting',
  })
  @ApiQuery({
    name: 'orderNo',
    required: false,
    description: 'Filter by order number',
  })
  @ApiQuery({
    name: 'businessName',
    required: false,
    description: 'Filter by business name',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['In Progress', 'Delivered', 'Cancelled'],
    isArray: true,
    description: 'Filter by order status. Can select multiple statuses',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort direction',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: ListOrderResponseDTO,
  })
  async getOrderList(
    @Query(ValidationPipe) requestDTO: ListOrderRequestDTO,
  ): Promise<ResponseDTO<ListOrderResponseDTO>> {
    const filter = OrderMapper.toFilter(requestDTO);
    const responseDTO =
      await this.orderService.getAllOrdersWithSearchCriteria(filter);
    return this.responseUtil.successResponse(0, responseDTO);
  }

  @Post('createOrder')
  @MessagePattern('createOrder')
  @ApiOperation({
    summary: 'Create new order',
    description: 'Creates a new order in the system with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Order has been successfully placed.',
    type: OrderBasicInfoDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Order creation payload',
    examples: {
      example1: {
        value: {
          orderNo: 'AE-A-2501001',
          businessName: 'ABC Corp',
          status: 'In Progress',
          quantity: 1,
          orderValue: 100.5,
        },
      },
    },
  })
  async createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ): Promise<ResponseDTO<OrderBasicInfoDTO>> {
    const responseDTO = await this.orderService.createOrder(createOrderDto);
    return this.responseUtil.successResponse(0, responseDTO);
  }
}
