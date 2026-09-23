export interface ObservationProps {
  id: string;
  indicatorId: string;
  referenceDate: Date;
  value: number;
}

export class Observation {
  constructor(private readonly props: ObservationProps) { }

  get id(): string {
    return this.props.id;
  }

  get indicatorId(): string {
    return this.props.indicatorId;
  }

  get referenceDate(): Date {
    return this.props.referenceDate;
  }

  get value(): number {
    return this.props.value;
  }

}