import { FilterQuery, Model, SaveOptions } from 'mongoose';
import { Document } from 'mongoose';
import { IRepository } from './interface/repository.interface';

import { CreatedModel, RemovedModel } from '../util/entity';

export class Repository<T extends Document> implements IRepository<T> {
  constructor(private readonly model: Model<T>) {}
  async findOne(id: string): Promise<T> {
    return await this.model.findById(id).exec();
  }

  async create(doc: object, saveOptions?: SaveOptions): Promise<CreatedModel> {
    const createdEntity = new this.model(doc);
    const savedResult = await createdEntity.save(saveOptions);

    return { id: savedResult.id, created: !!savedResult.id };
  }
  async find(query: any): Promise<T[]> {
    const { filter, options } = this.splitFilterAndOptions(query);
    return this.model.find(filter, null, options).exec() as Promise<T[]>;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async remove(filter: FilterQuery<T>): Promise<RemovedModel> {
    const { deletedCount } = await this.model.deleteMany(filter);
    return { deletedCount, deleted: !!deletedCount };
  }

  async countDocuments(filter: FilterQuery<T>) {
    const filteredCount = await this.model.countDocuments(filter);
    return filteredCount;
  }

  async findOneBy(criteria: Partial<T>): Promise<T> {
    const whereConditions = Object.entries(criteria).map(([key, value]) => ({
      [key]: value,
    }));
    return await this.model.findOne({
      where: whereConditions,
    });
  }
  splitFilterAndOptions(query: any): { filter: any; options: any } {
    const { page, limit, sortColumn, sortOrder, ...filter } = query;
    const options: any = {};
    if (page && limit) {
      options.skip = (page - 1) * limit;
      options.limit = limit;
    }
    if (sortColumn && sortOrder) {
      options.sort = { [sortColumn]: sortOrder === 'DESC' ? -1 : 1 };
    }
    return { filter, options };
  }
}
