import { IFavoriteRepository } from '@/domain/repositories/IFavoriteRepository';
import { Favorite } from '@/domain/entities/Favorite';
import { PrismaClient } from '@/infrastructure/database/prisma/generated/client';
import { FavoriteMapper } from '@/infrastructure/mappers/FavoriteMapper';

export class PrismaFavoriteRepository implements IFavoriteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Favorite[]> {
    const records = await this.prisma.favorite.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(FavoriteMapper.toDomain);
  }

  async findByIndicatorId(indicatorId: string): Promise<Favorite | null> {
    const record = await this.prisma.favorite.findUnique({
      where: { indicatorId },
    });
    return record ? FavoriteMapper.toDomain(record) : null;
  }

  async add(favorite: Favorite): Promise<void> {
    await this.prisma.favorite.create({
      data: FavoriteMapper.toCreateInput(favorite),
    });
  }

  async remove(indicatorId: string): Promise<void> {
    await this.prisma.favorite.delete({
      where: { indicatorId },
    });
  }
}