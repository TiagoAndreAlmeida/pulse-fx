export interface IndicatorProps {
  id: string;
  name: string;
  source: 'BCB' | 'FRED';
  unit: 'CURRENCY' | 'INDEX' | 'PERCENTAGE';
  frequency: 'DAILY' | 'MONTHLY';
  lastValue: number;
  variation: number;
  updatedAt: Date;
}

export class Indicator {
  constructor(private readonly props: IndicatorProps) { }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get source(): 'BCB' | 'FRED' {
    return this.props.source;
  }

  get unit(): 'CURRENCY' | 'INDEX' | 'PERCENTAGE' {
    return this.props.unit;
  }

  get frequency(): 'DAILY' | 'MONTHLY' {
    return this.props.frequency;
  }

  get lastValue(): number {
    return this.props.lastValue;
  }

  get variation(): number {
    return this.props.variation;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}