import { Indicator } from '@/domain/entities/Indicator';
import { Prisma, Indicator as PrismaIndicator } from '@/infrastructure/database/prisma/generated/client';

export class IndicatorMapper {
  static toDomain(prisma: PrismaIndicator & { favorite?: { indicatorId: string } | null }): Indicator {
    return new Indicator({
      id: prisma.id,
      name: prisma.name,
      source: prisma.source,
      unit: prisma.unit,
      frequency: prisma.frequency,
      lastValue: Number(prisma.lastValue),
      variation: Number(prisma.variation),
      updatedAt: prisma.updatedAt,
      favoriteId: prisma.favorite?.indicatorId,
    });
  }

  static toCreateInput(domain: Indicator): Prisma.IndicatorUncheckedCreateInput {
    return {
      id: domain.id,
      name: domain.name,
      source: domain.source,
      unit: domain.unit,
      frequency: domain.frequency,
      lastValue: domain.lastValue,
      variation: domain.variation,
      updatedAt: domain.updatedAt,
    };
  }

  static toUpdateInput(domain: Indicator): Prisma.IndicatorUncheckedUpdateInput {
    return {
      lastValue: domain.lastValue,
      variation: domain.variation,
      updatedAt: domain.updatedAt,
    };
  }
}