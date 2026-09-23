import { IObservationRepository } from '@/domain/repositories/IObservationRepository';
import { Observation } from '@/domain/entities/Observation';
import { PrismaClient } from '@/infrastructure/database/prisma/generated/client';
import { ObservationMapper } from '@/infrastructure/mappers/ObservationMapper';

export class PrismaObservationRepository implements IObservationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByIndicatorId(indicatorId: string, limit?: number): Promise<Observation[]> {
    const records = await this.prisma.observation.findMany({
      where: { indicatorId },
      orderBy: { referenceDate: 'desc' },
      take: limit,
    });
    return records.map(ObservationMapper.toDomain);
  }

  async findLatest(indicatorId: string): Promise<Observation | null> {
    const record = await this.prisma.observation.findFirst({
      where: { indicatorId },
      orderBy: { referenceDate: 'desc' },
    });
    return record ? ObservationMapper.toDomain(record) : null;
  }

  async findByIndicatorIdBeforeDate(indicatorId: string, beforeDate: Date): Promise<Observation | null> {
    const record = await this.prisma.observation.findFirst({
      where: {
        indicatorId,
        referenceDate: { lt: beforeDate },
      },
      orderBy: { referenceDate: 'desc' },
    });
    return record ? ObservationMapper.toDomain(record) : null;
  }

  async findByIndicatorIdInDateRange(indicatorId: string, start: Date, end: Date): Promise<Observation | null> {
    const record = await this.prisma.observation.findFirst({
      where: {
        indicatorId,
        referenceDate: { gte: start, lt: end },
      },
      orderBy: { referenceDate: 'desc' },
    });
    return record ? ObservationMapper.toDomain(record) : null;
  }

  async saveMany(observations: Observation[]): Promise<void> {
    if (observations.length === 0) return;

    const data = observations.map(ObservationMapper.toCreateManyInput);
    await this.prisma.observation.createMany({
      data,
      skipDuplicates: true,
    });
  }
}