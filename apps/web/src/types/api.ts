export type IndicatorSource = 'BCB' | 'FRED';
export type IndicatorUnit = 'CURRENCY' | 'INDEX' | 'PERCENTAGE';
export type IndicatorFrequency = 'DAILY' | 'MONTHLY';

export interface IndicatorCardDTO {
  id: string;
  name: string;
  source: IndicatorSource;
  unit: IndicatorUnit;
  frequency: IndicatorFrequency;
  lastValue: number;
  variation: number;
  referenceDate: string;
  isFavorite?: boolean;
}

export interface ObservationPointDTO {
  date: string;
  value: number;
}

export interface IndicatorDetailDTO {
  id: string;
  name: string;
  source: IndicatorSource;
  unit: IndicatorUnit;
  frequency: IndicatorFrequency;
  lastValue: number;
  variation: number;
  referenceDate: string;
  observations: ObservationPointDTO[];
}

export interface SyncResultItem {
  indicatorId: string;
  synced: number;
  error?: string;
}

export interface SyncResult {
  items: SyncResultItem[];
  timestamp: string;
}

export interface ToggleFavoriteResponse {
  isFavorite: boolean;
}