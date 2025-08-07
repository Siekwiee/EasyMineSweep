import type { BoardState } from '../board/board.types';
import type { Cell } from '../cell/cell.types';

/**
 * Adjacent neighbor offsets in 8 directions around a cell.
 * Order is irrelevant; we just need exhaustive coverage.
 */
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

/** Returns true if (r, c) is a valid coordinate on the board. */
const inBounds = (state: BoardState, row: number, col: number) =>
  row >= 0 && row < state.rows && col >= 0 && col < state.cols;

/**
 * Create a new game board without placing mines yet.
 * Why defer mine placement? So the first revealed cell (and its neighbors)
 * are guaranteed safe. We set `firstClickSafe` to enforce that invariant.
 */
export function createGame(
  rows: number,
  cols: number,
  mines: number,
): BoardState {
  const grid: Cell[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      mine: false,
      revealed: false,
      flagged: false,
      count: 0,
    })),
  );

  // Defer mine placement until first reveal (firstClickSafe)
  return {
    rows,
    cols,
    mines,
    grid,
    status: 'playing',
    flags: 0,
    revealedCount: 0,
    firstClickSafe: true,
  };
}

/**
 * Place mines randomly while keeping the first-clicked cell and its neighbors safe.
 * We shuffle the list of eligible cells (Fisher–Yates) and mark the first `mines` entries.
 * After placement, compute and cache each cell's adjacent mine count.
 */
function placeMines(state: BoardState, safeR: number, safeC: number) {
  const { rows, cols, mines } = state;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Avoid the first clicked cell and its neighbors
      const isSafe = Math.abs(row - safeR) <= 1 && Math.abs(col - safeC) <= 1;
      if (!isSafe) {
        cells.push([row, col]);
      }
    }
  }
  // Fisher-Yates shuffle
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const toPlace = Math.min(mines, cells.length);
  for (let i = 0; i < toPlace; i++) {
    const [row, col] = cells[i];
    state.grid[row][col].mine = true;
  }
  // compute counts
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      state.grid[row][col].count = directions.reduce((acc, [dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        if (inBounds(state, newRow, newCol)) {
          return acc + (state.grid[newRow][newCol].mine ? 1 : 0);
        }
        return acc;
      }, 0);
    }
  }
}

/**
 * Reveal contiguous empty (count = 0) areas using a stack (iterative DFS) to
 * avoid recursion limits. Marks visited cells revealed and tracks total
 * revealed cells for win checking.
 */
function floodReveal(state: BoardState, row: number, col: number) {
  const stack: Array<[number, number]> = [[row, col]];
  while (stack.length > 0) {
    const [curRow, curCol] = stack.pop()!;
    const cell = state.grid[curRow][curCol];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    state.revealedCount++;
    if (cell.count === 0 && !cell.mine) {
      for (const [dr, dc] of directions) {
        const newRow = curRow + dr;
        const newCol = curCol + dc;
        if (inBounds(state, newRow, newCol)) {
          const ncell = state.grid[newRow][newCol];
          if (!ncell.revealed && !ncell.flagged && !ncell.mine) {
            stack.push([newRow, newCol]);
          }
        }
      }
    }
  }
}

/**
 * If all non-mine cells are revealed, mark the game as won. Optionally, reveal
 * mines too for visual feedback.
 */
function checkWin(state: BoardState) {
  const totalSafe = state.rows * state.cols - state.mines;
  if (state.revealedCount >= totalSafe && state.status === 'playing') {
    state.status = 'won';
    // auto-reveal remaining mines (optional)
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const cell = state.grid[row][col];
        if (cell.mine) {
          cell.revealed = true;
        }
      }
    }
  }
}

/**
 * Handle a left-click reveal action.
 * - First click triggers mine placement with a safety halo.
 * - Clicking a mine ends the game and reveals all mines.
 * - Otherwise, flood-reveal empties and check for win.
 * Returns a new immutable `BoardState`.
 */
export function revealCell(
  prev: BoardState,
  row: number,
  col: number,
): BoardState {
  if (prev.status !== 'playing') return prev;
  const state: BoardState = structuredClone(prev);
  const cell = state.grid[row][col];
  if (cell.revealed || cell.flagged) return prev;

  if (state.firstClickSafe) {
    placeMines(state, row, col);
    state.firstClickSafe = false;
  }

  if (cell.mine) {
    // If first click hit a mine due to no placement yet, safeguard above prevents that
    cell.revealed = true;
    state.status = 'lost';
    // reveal all mines
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        if (state.grid[row][col].mine) {
          state.grid[row][col].revealed = true;
        }
      }
    }
    return state;
  }

  floodReveal(state, row, col);
  checkWin(state);
  return state;
}

/**
 * Toggle a flag on a hidden cell. Flags help track suspected mines and adjust
 * the "remaining" indicator in the UI. No effect on revealed cells.
 * Returns a new immutable `BoardState`.
 */
export function toggleFlag(
  prev: BoardState,
  row: number,
  col: number,
): BoardState {
  if (prev.status !== 'playing') return prev;
  const state: BoardState = structuredClone(prev);
  const cell = state.grid[row][col];
  if (cell.revealed) return prev;
  cell.flagged = !cell.flagged;
  state.flags += cell.flagged ? 1 : -1;
  return state;
}
