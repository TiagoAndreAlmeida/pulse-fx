import { Indicator } from '@/domain/entities/Indicator';

export interface IndicatorCardDTO {
  id: string;
  name: string;
  source: 'BCB' | 'FRED';
  unit: 'CURRENCY' | 'INDEX' | 'PERCENTAGE';
  frequency: 'DAILY' | 'MONTHLY';
  lastValue: number;
  variation: number;
  referenceDate: Date;
}

export function toIndicatorCardDTO(indicator: Indicator): IndicatorCardDTO {
  return {
    id: indicator.id,
    name: indicator.name,
    source: indicator.source,
    unit: indicator.unit,
    frequency: indicator.frequency,
    lastValue: indicator.lastValue,
    variation: indicator.variation,
    referenceDate: indicator.updatedAt,
  };
}