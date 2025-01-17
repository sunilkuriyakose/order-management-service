import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';
import { SwaggerController } from './swagger/swagger.controller';

@Module({
  imports: [OrderModule, DatabaseModule],
  controllers: [SwaggerController],
  providers: [],
})
export class AppModule {}
