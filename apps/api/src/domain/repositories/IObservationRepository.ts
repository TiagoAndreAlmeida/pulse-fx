import { Observation } from '../entities/Observation';

export interface IObservationRepository {
  findByIndicatorId(indicatorId: string, limit?: number): Promise<Observation[]>;
  findLatest(indicatorId: string): Promise<Observation | null>;
  findByIndicatorIdBeforeDate(indicatorId: string, beforeDate: Date): Promise<Observation | null>;
  findByIndicatorIdInDateRange(indicatorId: string, start: Date, end: Date): Promise<Observation | null>;
  saveMany(observations: Observation[]): Promise<void>;
}