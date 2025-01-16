import { SaveOptions } from 'mongoose';
import { CreatedModel } from 'src/util/entity';

export interface IRepository<T> {
  create(doc: object, saveOptions?: SaveOptions): Promise<CreatedModel>;
  findAll(): Promise<T[]>;
  find(filter: any): Promise<T[]>;
  findOne(id: string): Promise<T>;
  splitFilterAndOptions(query: any): { filter: any; options: any };
  // update(id: string, item: T): Promise<T>;
  // delete(id: string): Promise<T>;
}
