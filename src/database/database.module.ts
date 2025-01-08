import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import database from './constants/database';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sunilkuriyakose:kZLTw9SnIxSI0YgD@trdappcluster0.kn9kf.mongodb.net/',
      {
        dbName: database.DATABASE_NAME,
      },
    ),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
