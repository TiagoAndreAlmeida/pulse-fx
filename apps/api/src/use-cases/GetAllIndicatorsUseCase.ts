import { IIndicatorRepository } from '@/domain/repositories/IIndicatorRepository';
import { IndicatorCardDTO, toIndicatorCardDTO } from './dtos/IndicatorCardDTO';

export interface GetAllIndicatorsOutput {
  indicators: IndicatorCardDTO[];
}

export class GetAllIndicatorsUseCase {
  constructor(private readonly indicatorRepo: IIndicatorRepository) {}

  async execute(): Promise<GetAllIndicatorsOutput> {
    const indicators = await this.indicatorRepo.findAll();
    return { indicators: indicators.map(toIndicatorCardDTO) };
  }
}