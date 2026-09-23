import { IExternalProvider, ExternalObservation } from '@/domain/repositories/IExternalProvider';

const BCB_INDICATOR_CODES: Record<string, number> = {
  USD_BRL: 1,
  SELIC: 432,
};

export class BcbSgsProvider implements IExternalProvider {
  private readonly baseUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs';

  async fetchData(indicatorId: string, startDate: Date): Promise<ExternalObservation[]> {
    const code = BCB_INDICATOR_CODES[indicatorId];
    if (!code) {
      throw new Error(`Indicador BCB não mapeado: ${indicatorId}`);
    }

    const start = this.formatDate(startDate);
    const url = `${this.baseUrl}/${code}/dados?formato=json&dataInicial=${start}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do BCB: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as any[];
    return this.parseResponse(data);
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private parseResponse(data: any[]): ExternalObservation[] {
    if (!Array.isArray(data)) return [];

    return data
      .map((item) => {
        const date = this.parseBcbDate(item.data);
        const value = Number(item.valor);
        return { referenceDate: date, value };
      })
      .filter((item) => !isNaN(item.value));
  }

  private parseBcbDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
}