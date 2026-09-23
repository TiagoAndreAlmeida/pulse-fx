import { GetAllIndicatorsUseCase } from '@/use-cases/GetAllIndicatorsUseCase';
import { GetFavoriteIndicatorsUseCase } from '@/use-cases/GetFavoriteIndicatorsUseCase';
import { GetIndicatorDetailUseCase } from '@/use-cases/GetIndicatorDetailUseCase';
import { ToggleFavoriteUseCase } from '@/use-cases/ToggleFavoriteUseCase';
import { makeIndicatorRepository } from './repositories';
import { makeObservationRepository } from './repositories';
import { makeFavoriteRepository } from './repositories';

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

export function makeToggleFavoriteUseCase(): ToggleFavoriteUseCase {
  return new ToggleFavoriteUseCase(
    makeIndicatorRepository(),
    makeFavoriteRepository()
  );
}