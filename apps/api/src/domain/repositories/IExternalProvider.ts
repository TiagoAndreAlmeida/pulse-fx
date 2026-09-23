export interface ExternalObservation {
  referenceDate: Date;
  value: number;
}

export interface IExternalProvider {
  fetchData(indicatorId: string, startDate: Date): Promise<ExternalObservation[]>;
}