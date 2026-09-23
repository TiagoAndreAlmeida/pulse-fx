export interface FavoriteProps {
  indicatorId: string;
  createdAt: Date;
}

export class Favorite {
  constructor(private readonly props: FavoriteProps) { }

  get indicatorId(): string {
    return this.props.indicatorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

}