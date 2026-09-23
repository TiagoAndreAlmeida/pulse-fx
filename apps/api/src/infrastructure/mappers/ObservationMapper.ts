import { Observation } from '@/domain/entities/Observation';
import { Prisma, Observation as PrismaObservation } from '@/infrastructure/database/prisma/generated/client';

export class ObservationMapper {
  static toDomain(prisma: PrismaObservation): Observation {
    return new Observation({
      id: prisma.id,
      indicatorId: prisma.indicatorId,
      referenceDate: prisma.referenceDate,
      value: Number(prisma.value),
    });
  }

  static toCreateInput(domain: Observation): Prisma.ObservationUncheckedCreateInput {
    return {
      id: domain.id,
      indicatorId: domain.indicatorId,
      referenceDate: domain.referenceDate,
      value: domain.value,
    };
  }

  static toCreateManyInput(domain: Observation): Prisma.ObservationCreateManyInput {
    return {
      id: domain.id,
      indicatorId: domain.indicatorId,
      referenceDate: domain.referenceDate,
      value: domain.value,
    };
  }
}