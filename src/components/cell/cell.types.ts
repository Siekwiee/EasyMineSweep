export type Cell = {
  r: number;
  c: number;
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  count: number; // adjacent mines
};
