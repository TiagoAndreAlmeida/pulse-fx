import { GetAllIndicatorsUseCase } from '@/use-cases/GetAllIndicatorsUseCase';
import { GetFavoriteIndicatorsUseCase } from '@/use-cases/GetFavoriteIndicatorsUseCase';
import { makeIndicatorRepository } from './repositories';

export function makeGetAllIndicatorsUseCase(): GetAllIndicatorsUseCase {
  return new GetAllIndicatorsUseCase(makeIndicatorRepository());
}

export function makeGetFavoriteIndicatorsUseCase(): GetFavoriteIndicatorsUseCase {
  return new GetFavoriteIndicatorsUseCase(makeIndicatorRepository());
}