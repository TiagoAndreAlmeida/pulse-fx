import { IIndicatorRepository } from '@/domain/repositories/IIndicatorRepository';
import { IFavoriteRepository } from '@/domain/repositories/IFavoriteRepository';
import { Favorite } from '@/domain/entities/Favorite';

export class ToggleFavoriteUseCase {
  constructor(
    private readonly indicatorRepo: IIndicatorRepository,
    private readonly favoriteRepo: IFavoriteRepository
  ) {}

  async execute(indicatorId: string): Promise<{ isFavorite: boolean }> {
    const indicator = await this.indicatorRepo.findById(indicatorId);
    if (!indicator) throw new Error(`Indicador ${indicatorId} não encontrado`);

    const favorite = await this.favoriteRepo.findByIndicatorId(indicatorId);
    const currentlyFavorite = !!favorite;

    if (currentlyFavorite) {
      await this.favoriteRepo.remove(indicatorId);
    } else {
      await this.favoriteRepo.add(Favorite.create({ indicatorId, createdAt: new Date() }));
    }

    return { isFavorite: !currentlyFavorite };
  }
}