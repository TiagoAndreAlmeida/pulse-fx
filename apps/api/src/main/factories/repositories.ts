import { IIndicatorRepository } from '@/domain/repositories/IIndicatorRepository';
import { IObservationRepository } from '@/domain/repositories/IObservationRepository';
import { IFavoriteRepository } from '@/domain/repositories/IFavoriteRepository';
import { PrismaIndicatorRepository } from '@/infrastructure/repositories/PrismaIndicatorRepository';
import { PrismaObservationRepository } from '@/infrastructure/repositories/PrismaObservationRepository';
import { PrismaFavoriteRepository } from '@/infrastructure/repositories/PrismaFavoriteRepository';
import { prisma } from '@/infrastructure/database/prisma/prisma-client';

export function makeIndicatorRepository(): IIndicatorRepository {
  return new PrismaIndicatorRepository(prisma);
}

export function makeObservationRepository(): IObservationRepository {
  return new PrismaObservationRepository(prisma);
}

export function makeFavoriteRepository(): IFavoriteRepository {
  return new PrismaFavoriteRepository(prisma);
}