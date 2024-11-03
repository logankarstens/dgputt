interface RowDataValue {
  makeCount: number;
  bonuses: boolean[];
}

export type RowData = RowDataValue | null;

export type RoundData = Array<RowData>;

export type GameData = Array<RoundData>;

export interface Game {
  user: string;
  date: string;
  game: GameData;
}