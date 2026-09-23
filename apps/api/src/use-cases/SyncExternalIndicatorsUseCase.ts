import { IIndicatorRepository } from '@/domain/repositories/IIndicatorRepository';
import { IObservationRepository } from '@/domain/repositories/IObservationRepository';
import { IExternalProvider, ExternalObservation } from '@/domain/repositories/IExternalProvider';
import { Indicator } from '@/domain/entities/Indicator';
import { Observation } from '@/domain/entities/Observation';
import { VariationCalculator } from '@/domain/services/VariationCalculator';

export interface SyncResultItem {
  indicatorId: string;
  synced: number;
  error?: string;
}

export interface SyncResult {
  items: SyncResultItem[];
  timestamp: Date;
}

export class SyncExternalIndicatorsUseCase {
  constructor(
    private readonly indicatorRepo: IIndicatorRepository,
    private readonly observationRepo: IObservationRepository,
    private readonly bcbProvider: IExternalProvider,
    private readonly fredProvider: IExternalProvider
  ) {}

  async execute(): Promise<SyncResult> {
    const indicators = await this.indicatorRepo.findAll();
    const items: SyncResultItem[] = [];

    await Promise.all(
      indicators.map(async (indicator) => {
        try {
          const provider = this.getProvider(indicator);
          const lastObs = await this.observationRepo.findLatest(indicator.id);
          const startDate = lastObs?.referenceDate || new Date('2026-01-01');

          const externalData = await provider.fetchData(indicator.id, startDate);

          if (externalData.length === 0) {
            items.push({ indicatorId: indicator.id, synced: 0 });
            return;
          }

          const domainObservations = externalData.map((dto) =>
            Observation.create({
              id: crypto.randomUUID(),
              indicatorId: indicator.id,
              referenceDate: dto.referenceDate,
              value: dto.value,
            })
          );

          await this.observationRepo.saveMany(domainObservations);

          const allObs = await this.observationRepo.findByIndicatorId(indicator.id, 2);
          if (allObs.length >= 2) {
            const [current, previous] = allObs;
            const variation = VariationCalculator.calculate(current.value, previous.value);
            indicator.updateValue(current.value, variation, current.referenceDate);
            await this.indicatorRepo.update(indicator);
          }

          items.push({ indicatorId: indicator.id, synced: externalData.length });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro desconhecido';
          console.error(`Erro ao sincronizar ${indicator.id}: ${message}`);
          items.push({ indicatorId: indicator.id, synced: 0, error: message });
        }
      })
    );

    return { items, timestamp: new Date() };
  }

  private getProvider(indicator: Indicator): IExternalProvider {
    return indicator.source === 'BCB' ? this.bcbProvider : this.fredProvider;
  }
}