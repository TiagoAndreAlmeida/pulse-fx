import { IIndicatorRepository } from '@/domain/repositories/IIndicatorRepository';
import { IObservationRepository } from '@/domain/repositories/IObservationRepository';
import { IndicatorDetailDTO, ObservationPointDTO } from './dtos/IndicatorDetailDTO';

export interface GetIndicatorDetailOutput {
  indicator: IndicatorDetailDTO;
}

export class GetIndicatorDetailUseCase {
  constructor(
    private readonly indicatorRepo: IIndicatorRepository,
    private readonly observationRepo: IObservationRepository
  ) {}

  async execute(indicatorId: string): Promise<GetIndicatorDetailOutput> {
    const indicator = await this.indicatorRepo.findById(indicatorId);
    if (!indicator) throw new Error(`Indicador ${indicatorId} não encontrado`);

    const limit = indicator.frequency === 'DAILY' ? 30 : 12;
    const observations = await this.observationRepo.findByIndicatorId(indicatorId, limit);

    const observationPoints: ObservationPointDTO[] = observations.map(o => ({
      date: o.referenceDate,
      value: o.value,
    }));

    return {
      indicator: {
        id: indicator.id,
        name: indicator.name,
        source: indicator.source,
        unit: indicator.unit,
        frequency: indicator.frequency,
        lastValue: indicator.lastValue,
        variation: indicator.variation,
        referenceDate: indicator.updatedAt,
        observations: observationPoints,
      },
    };
  }
}