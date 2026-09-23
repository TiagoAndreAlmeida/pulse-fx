import { Favorite } from '@/domain/entities/Favorite';
import { Prisma, Favorite as PrismaFavorite } from '@/infrastructure/database/prisma/generated/client';

export class FavoriteMapper {
  static toDomain(prisma: PrismaFavorite): Favorite {
    return new Favorite({
      indicatorId: prisma.indicatorId,
      createdAt: prisma.createdAt,
    });
  }

  static toCreateInput(domain: Favorite): Prisma.FavoriteUncheckedCreateInput {
    return {
      indicatorId: domain.indicatorId,
      createdAt: domain.createdAt,
    };
  }
}