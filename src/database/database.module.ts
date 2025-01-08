import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import database from './constants/database';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/', {
      dbName: database.DATABASE_NAME,
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
