import { RequestHandler } from 'express';
import { GetAllIndicatorsUseCase } from '@/use-cases/GetAllIndicatorsUseCase';
import { GetFavoriteIndicatorsUseCase } from '@/use-cases/GetFavoriteIndicatorsUseCase';
import { GetIndicatorDetailUseCase } from '@/use-cases/GetIndicatorDetailUseCase';
import { ToggleFavoriteUseCase } from '@/use-cases/ToggleFavoriteUseCase';
import { SyncExternalIndicatorsUseCase } from '@/use-cases/SyncExternalIndicatorsUseCase';
import { makeIndicatorRepository } from './repositories';
import { makeObservationRepository } from './repositories';
import { makeFavoriteRepository } from './repositories';
import { makeBcbProvider } from './providers';
import { makeFredProvider } from './providers';

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

export function makeSyncExternalIndicatorsUseCase(): SyncExternalIndicatorsUseCase {
  return new SyncExternalIndicatorsUseCase(
    makeIndicatorRepository(),
    makeObservationRepository(),
    makeBcbProvider(),
    makeFredProvider()
  );
}

export function makeAdminSyncRoute(): RequestHandler {
  return new (require('@/infrastructure/http/controllers/admin-sync').makeAdminSyncRoute)(
    makeSyncExternalIndicatorsUseCase()
  );
}