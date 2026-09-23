import { IIndicatorRepository } from '@/domain/repositories/IIndicatorRepository';
import { Indicator } from '@/domain/entities/Indicator';
import { PrismaClient } from '@/infrastructure/database/prisma/generated/client';
import { IndicatorMapper } from '@/infrastructure/mappers/IndicatorMapper';

export class PrismaIndicatorRepository implements IIndicatorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Indicator[]> {
    const records = await this.prisma.indicator.findMany({
      orderBy: { name: 'asc' },
    });
    return records.map(IndicatorMapper.toDomain);
  }

  async findById(id: string): Promise<Indicator | null> {
    const record = await this.prisma.indicator.findUnique({
      where: { id },
    });
    return record ? IndicatorMapper.toDomain(record) : null;
  }

  async findFavorites(): Promise<Indicator[]> {
    const records = await this.prisma.indicator.findMany({
      where: { favorite: { isNot: null } },
      orderBy: { name: 'asc' },
    });
    return records.map(IndicatorMapper.toDomain);
  }

  async save(indicator: Indicator): Promise<void> {
    await this.prisma.indicator.create({
      data: IndicatorMapper.toCreateInput(indicator),
    });
  }

  async update(indicator: Indicator): Promise<void> {
    await this.prisma.indicator.update({
      where: { id: indicator.id },
      data: IndicatorMapper.toUpdateInput(indicator),
    });
  }
}