import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Order, OrderSchema } from './schemas/order.schema';
import {
  ProductDetails,
  ProductDetailsSchema,
} from './schemas/product-details.schema';
import {
  ShipmentDetails,
  ShipmentDetailsSchema,
} from './schemas/shipment-details.schema';
import { StoreInfo, StoreInfoSchema } from './schemas/store-info.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `dev.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
        user: configService.get<string>('DB_USERNAME'),
        pass: configService.get<string>('DB_PASSWORD'),
        dbName: configService.get<string>('DB_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: ProductDetails.name, schema: ProductDetailsSchema },
      { name: ShipmentDetails.name, schema: ShipmentDetailsSchema },
      { name: StoreInfo.name, schema: StoreInfoSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule],
})
export class DatabaseModule {}
