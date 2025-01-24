import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from '../database/schemas/order.schema';
import { ProductDetails } from '../database/schemas/product-details.schema';
import { OrderRepository } from './repository/order.repository';
import { OrderNumberUtil } from '../util/order-number.util';
import { Model, Document } from 'mongoose';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ShipmentDetails } from '../database/schemas/shipment-details.schema';
import { OrderMapper } from '../util/mapper/order.mapper';

describe('OrderService', () => {
  let service: OrderService;
  let productDetailsModel: Model<ProductDetails>;
  let orderRepository: OrderRepository;
  let orderNumberUtil: OrderNumberUtil;

  const mockOrder = {
    _id: '678e01fc0d5a6240c3f17c0a',
    orderNo: 'AE-A-2501100',
    orderValue: 210,
    quantity: 10,
    businessName: 'Test Business',
    status: 'In Progress',
    date: new Date(),
    product_details: [],
    shipment_details: [],
  };

  const mockProductDetail = {
    id: 1,
    sku: 'AXMMOSGH12GB12GBBLK',
    unit_price: 20,
    quantity: 10,
    vat_percent: '5%',
    vat: 10,
    total_price: 200,
    grand_total: 210,
  };

  const mockStoreInfo = {
    id: 1,
    dealer_id: 2014,
    businessName: 'Test Business',
    region: 'Dubai',
    area: 'Dubai Silicon Oasis',
    dealer_type: 'Credit',
    status: 'Active',
    created_date: new Date(),
    updated_date: new Date(),
  };

  const mockOrderResponse = {
    _id: '678e01fc0d5a6240c3f17c0a',
    orderNo: 'AE-A-2501100',
    orderValue: 210,
    quantity: 10,
    businessName: 'Test Business',
    status: 'In Progress',
    date: new Date(),
    product_details: [mockProductDetail],
    shipment_details: [],
    store_info: mockStoreInfo,
  } as unknown as Order & Document;

  const mockOrderWithSelect = {
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockOrderResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockOrderResponse),
            findByIdAndUpdate: jest.fn().mockReturnValue(mockOrderWithSelect),
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(ProductDetails.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockProductDetail),
            insertMany: jest.fn().mockResolvedValue([mockProductDetail]),
          },
        },
        {
          provide: getModelToken(ShipmentDetails.name),
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              order_id: mockOrder._id,
              order_no: mockOrder.orderNo,
              status: 'Requested',
              delivered_quantity: 0,
              delivered_by: 'Not Assigned',
              delivered_date: new Date(),
              total_price: mockOrder.orderValue,
              grand_total: mockOrder.orderValue,
            }),
          },
        },
        {
          provide: OrderRepository,
          useValue: {
            create: jest.fn().mockImplementation((dto) =>
              Promise.resolve({
                ...mockOrderResponse,
                ...dto,
                orderNo: 'AE-A-2501100',
              }),
            ),
            findById: jest.fn().mockResolvedValue(mockOrder),
            find: jest.fn().mockImplementation((params) => {
              // Apply mock pagination and sorting
              const mockResult = [mockOrder];
              if (params.limit) {
                return Promise.resolve(mockResult.slice(0, params.limit));
              }
              return Promise.resolve(mockResult);
            }),
            countDocuments: jest.fn().mockResolvedValue(1),
            buildFilter: jest.fn().mockReturnValue({}),
          },
        },
        {
          provide: OrderNumberUtil,
          useValue: {
            generateOrderNo: jest.fn().mockResolvedValue('AE-A-2501100'),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    productDetailsModel = module.get<Model<ProductDetails>>(
      getModelToken(ProductDetails.name),
    );
    orderRepository = module.get<OrderRepository>(OrderRepository);
    orderNumberUtil = module.get<OrderNumberUtil>(OrderNumberUtil);

    jest.spyOn(OrderMapper, 'toBasicInfoDTO').mockImplementation(() => ({
      id: mockOrderResponse._id.toString(),
      orderNo: mockOrderResponse.orderNo,
      orderValue: mockOrderResponse.orderValue,
      quantity: mockOrderResponse.quantity,
      businessName: mockOrderResponse.businessName,
      status: mockOrderResponse.status,
      date: mockOrderResponse.date,
      product_details: mockOrderResponse.product_details.map((pd) => ({
        id: pd.id,
        sku: pd.sku,
        unit_price: pd.unit_price,
        quantity: pd.quantity,
        vat_percent: pd.vat_percent,
        vat: pd.vat,
        total_price: pd.total_price,
        grand_total: pd.grand_total,
      })),
      shipment_details: mockOrderResponse.shipment_details.map((sd) => ({
        id: sd.id,
        order_id: sd.order_id.toString(),
        order_no: sd.order_no,
        status: sd.status,
        delivered_quantity: sd.delivered_quantity,
        delivered_by: sd.delivered_by,
        delivered_date: sd.delivered_date,
        total_price: sd.total_price,
        grand_total: sd.grand_total,
      })),
      store_info: {
        id: mockOrderResponse.store_info.id,
        dealer_id: mockOrderResponse.store_info.dealer_id,
        businessName: mockOrderResponse.store_info.businessName,
        region: mockOrderResponse.store_info.region,
        area: mockOrderResponse.store_info.area,
        dealer_type: mockOrderResponse.store_info.dealer_type,
        status: mockOrderResponse.store_info.status,
        created_date: mockOrderResponse.store_info.created_date,
        updated_date: mockOrderResponse.store_info.updated_date,
      },
    }));
  });

  it('Needs to be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('has to create an order with product details', async () => {
      const createOrderDto: CreateOrderDto = {
        businessName: 'Test Business',
        status: 'In Progress',
        quantity: 10,
        orderValue: 210,
        product_details: [mockProductDetail],
      };

      const result = await service.createOrder(createOrderDto);

      expect(result).toBeDefined();
      expect(result.orderNo).toBe('AE-A-2501100');
      expect(orderNumberUtil.generateOrderNo).toHaveBeenCalled();
      expect(orderRepository.create).toHaveBeenCalled();
    });

    it('should fail order creation without product details', async () => {
      const createOrderDto: CreateOrderDto = {
        businessName: 'Test Business',
        status: 'In Progress',
        quantity: 10,
        orderValue: 210,
        product_details: [], // Empty product details
      };

      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        'Order must have at least one product',
      );

      expect(orderNumberUtil.generateOrderNo).toHaveBeenCalled();
      expect(productDetailsModel.create).not.toHaveBeenCalled();
      expect(orderRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return an order by id', async () => {
      const result = await service.findById('678e01fc0d5a6240c3f17c0a');

      expect(result).toBeDefined();
      expect(result.orderNo).toBe('AE-A-2501100');
      expect(orderRepository.findById).toHaveBeenCalledWith(
        '678e01fc0d5a6240c3f17c0a',
      );
    });

    it('should throw error for invalid id', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce(null);

      await expect(
        service.findById('678e01fc0d5a6240c3f17c0b'),
      ).rejects.toThrow('Order with the provided id is not available');
    });
  });

  describe('getAllOrdersWithSearchCriteria', () => {
    it('should return filtered orders with pagination', async () => {
      const filter = {
        businessName: 'Test',
        page: 1,
        limit: 10,
      };

      const result = await service.getAllOrdersWithSearchCriteria(filter);

      expect(result).toBeDefined();
      expect(result.orderList).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(orderRepository.find).toHaveBeenCalled();
      expect(orderRepository.countDocuments).toHaveBeenCalled();
    });

    it('should filter orders by status', async () => {
      const filter = {
        status: ['In Progress'],
        page: 1,
        limit: 10,
      };

      jest
        .spyOn(orderRepository, 'find')
        .mockResolvedValueOnce([mockOrderResponse]);

      const result = await service.getAllOrdersWithSearchCriteria(filter);

      expect(result.orderList[0].status).toBe('In Progress');
      expect(orderRepository.buildFilter).toHaveBeenCalledWith(filter);
    });

    it('should handle empty result set', async () => {
      const filter = {
        businessName: 'Nonexistent',
        page: 1,
        limit: 10,
      };

      jest.spyOn(orderRepository, 'find').mockResolvedValueOnce([]);
      jest.spyOn(orderRepository, 'countDocuments').mockResolvedValueOnce(0);

      const result = await service.getAllOrdersWithSearchCriteria(filter);

      expect(result.orderList).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });

    it('should use default pagination when not provided', async () => {
      const filter = {
        businessName: 'Test',
      };

      await service.getAllOrdersWithSearchCriteria(filter);

      expect(orderRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
        }),
      );
    });

    it('should sort orders by date in descending order by default', async () => {
      const filter = {
        businessName: 'Test',
      };

      await service.getAllOrdersWithSearchCriteria(filter);

      expect(orderRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          sortColumn: 'date',
          sortOrder: 'DESC',
        }),
      );
    });

    it('should apply custom sorting when provided', async () => {
      const filter = {
        businessName: 'Test',
        sortColumn: 'orderValue',
        sortOrder: 'ASC' as 'ASC' | 'DESC',
      };

      await service.getAllOrdersWithSearchCriteria(filter);

      expect(orderRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          sortColumn: 'orderValue',
          sortOrder: 'ASC',
        }),
      );
    });

    it('should filter orders by multiple statuses', async () => {
      const filter = {
        status: ['In Progress', 'Delivered'],
        page: 1,
        limit: 10,
      };

      const mockOrders = [
        { ...mockOrderResponse, status: 'In Progress' },
        {
          ...mockOrderResponse,
          status: 'Delivered',
          _id: '678e01fc0d5a6240c3f17c0b',
        },
      ] as unknown as Order[];

      jest.spyOn(orderRepository, 'find').mockResolvedValueOnce(mockOrders);
      jest.spyOn(orderRepository, 'countDocuments').mockResolvedValueOnce(2);

      const result = await service.getAllOrdersWithSearchCriteria(filter);

      expect(result.orderList).toHaveLength(2);
      expect(['In Progress', 'Delivered']).toContain(
        result.orderList[0].status,
      );
      expect(['In Progress', 'Delivered']).toContain(
        result.orderList[1].status,
      );
      expect(orderRepository.buildFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ['In Progress', 'Delivered'],
        }),
      );
      expect(result.totalCount).toBe(2);
    });
  });
});
