import { Favorite } from '../entities/Favorite';

export interface IFavoriteRepository {
  findAll(): Promise<Favorite[]>;
  findByIndicatorId(indicatorId: string): Promise<Favorite | null>;
  add(favorite: Favorite): Promise<void>;
  remove(indicatorId: string): Promise<void>;
}