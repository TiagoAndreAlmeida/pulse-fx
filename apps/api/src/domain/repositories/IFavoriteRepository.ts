import { Favorite } from '../entities/Favorite';

export interface IFavoriteRepository {
  findAll(): Promise<Favorite[]>;
  add(favorite: Favorite): Promise<void>;
  remove(indicatorId: string): Promise<void>;
}