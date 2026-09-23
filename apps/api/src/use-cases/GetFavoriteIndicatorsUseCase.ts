import { IIndicatorRepository } from '@/domain/repositories/IIndicatorRepository';
import { IndicatorCardDTO, toIndicatorCardDTO } from './dtos/IndicatorCardDTO';

export interface GetFavoriteIndicatorsOutput {
  indicators: IndicatorCardDTO[];
}

export class GetFavoriteIndicatorsUseCase {
  constructor(private readonly indicatorRepo: IIndicatorRepository) {}

  async execute(): Promise<GetFavoriteIndicatorsOutput> {
    const indicators = await this.indicatorRepo.findFavorites();
    return { indicators: indicators.map(toIndicatorCardDTO) };
  }
}