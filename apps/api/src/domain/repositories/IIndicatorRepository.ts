import { Indicator } from '../entities/Indicator';

export interface IIndicatorRepository {
  findAll(): Promise<Indicator[]>;
  findById(id: string): Promise<Indicator | null>;
  findFavorites(): Promise<Indicator[]>;
  save(indicator: Indicator): Promise<void>;
  update(indicator: Indicator): Promise<void>;
}