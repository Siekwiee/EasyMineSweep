import { Box } from '@mui/material';
import type { BoardState } from './board.types';
import CellView from '../cell/cell';

type Props = {
  state: BoardState;
  onReveal: (r: number, c: number) => void;
  onRightClick: (r: number, c: number) => void;
};

export default function Board({ state, onReveal, onRightClick }: Props) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${state.cols}, 32px)`,
        gridAutoRows: '32px',
        gap: 0.5,
      }}
    >
      {state.grid.map((row, r) =>
        row.map((cell, c) => (
          <CellView
            key={`${r}-${c}`}
            cell={cell}
            status={state.status}
            onClick={() => onReveal(r, c)}
            onRightClick={() => onRightClick(r, c)}
          />
        )),
      )}
    </Box>
  );
}
