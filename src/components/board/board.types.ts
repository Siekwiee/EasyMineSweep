import type { Cell } from '../cell/cell.types';

export type BoardState = {
  rows: number;
  cols: number;
  mines: number;
  grid: Cell[][];
  status: 'playing' | 'won' | 'lost';
  flags: number;
  revealedCount: number;
  firstClickSafe: boolean;
};
