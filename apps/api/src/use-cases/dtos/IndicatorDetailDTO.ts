export interface ObservationPointDTO {
  date: Date;
  value: number;
}

export interface IndicatorDetailDTO {
  id: string;
  name: string;
  source: 'BCB' | 'FRED';
  unit: 'CURRENCY' | 'INDEX' | 'PERCENTAGE';
  frequency: 'DAILY' | 'MONTHLY';
  lastValue: number;
  variation: number;
  referenceDate: Date;
  observations: ObservationPointDTO[];
}