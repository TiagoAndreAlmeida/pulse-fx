import { GetAllIndicatorsUseCase } from '@/use-cases/GetAllIndicatorsUseCase';
import { GetFavoriteIndicatorsUseCase } from '@/use-cases/GetFavoriteIndicatorsUseCase';
import { GetIndicatorDetailUseCase } from '@/use-cases/GetIndicatorDetailUseCase';
import { makeIndicatorRepository } from './repositories';
import { makeObservationRepository } from './repositories';

export function makeGetAllIndicatorsUseCase(): GetAllIndicatorsUseCase {
  return new GetAllIndicatorsUseCase(makeIndicatorRepository());
}

export function makeGetFavoriteIndicatorsUseCase(): GetFavoriteIndicatorsUseCase {
  return new GetFavoriteIndicatorsUseCase(makeIndicatorRepository());
}

export function makeGetIndicatorDetailUseCase(): GetIndicatorDetailUseCase {
  return new GetIndicatorDetailUseCase(
    makeIndicatorRepository(),
    makeObservationRepository()
  );
}