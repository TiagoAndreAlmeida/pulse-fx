import { IExternalProvider, ExternalObservation } from '@/domain/repositories/IExternalProvider';

const FRED_SERIES_IDS: Record<string, string> = {
  FEDFUNDS: 'FEDFUNDS',
  CPI_US: 'CPIAUCSL',
};

export class FredApiProvider implements IExternalProvider {
  private readonly baseUrl = 'https://api.stlouisfed.org/fred/series/observations';
  private readonly apiKey: string;

  constructor() {
    const apiKey = process.env.FRED_API_KEY;
    if (!apiKey) {
      throw new Error('FRED_API_KEY não configurada');
    }
    this.apiKey = apiKey;
  }

  async fetchData(indicatorId: string, startDate: Date): Promise<ExternalObservation[]> {
    const seriesId = FRED_SERIES_IDS[indicatorId];
    if (!seriesId) {
      throw new Error(`Indicador FRED não mapeado: ${indicatorId}`);
    }

    const start = startDate.toISOString().split('T')[0];
    const url = `${this.baseUrl}?series_id=${seriesId}&api_key=${this.apiKey}&file_type=json&observation_start=${start}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do FRED: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseResponse(data);
  }

  private parseResponse(data: any): ExternalObservation[] {
    const observations = data?.observations;
    if (!Array.isArray(observations)) return [];

    return observations
      .map((item) => {
        const value = item.value === '.' ? NaN : Number(item.value);
        const date = new Date(item.date);
        return { referenceDate: date, value };
      })
      .filter((item) => !isNaN(item.value));
  }
}