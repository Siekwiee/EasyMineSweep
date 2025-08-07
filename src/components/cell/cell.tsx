import React from 'react';
import { Button } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { Cell } from './cell.types';

const numberColors: Record<number, string> = {
  1: '#1976d2',
  2: '#2e7d32',
  3: '#d32f2f',
  4: '#512da8',
  5: '#b71c1c',
  6: '#00838f',
  7: '#424242',
  8: '#616161',
};

type Props = {
  cell: Cell;
  status: 'playing' | 'won' | 'lost';
  onClick: () => void;
  onRightClick: () => void;
};

export default function CellView({
  cell,
  status,
  onClick,
  onRightClick,
}: Props) {
  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick();
  };

  const revealedMine = cell.revealed && cell.mine;
  const showMine = revealedMine || (status !== 'playing' && cell.mine);

  return (
    <Button
      variant={cell.revealed ? 'contained' : 'outlined'}
      color={revealedMine ? 'error' : 'primary'}
      onClick={onClick}
      onContextMenu={handleContext}
      sx={{
        minWidth: 0,
        width: 32,
        height: 32,
        p: 0,
        fontWeight: 700,
        bgcolor: cell.revealed ? 'grey.200' : undefined,
      }}
    >
      {!cell.revealed && cell.flagged ? (
        <FlagIcon fontSize="small" />
      ) : showMine ? (
        <WarningAmberIcon fontSize="small" color="error" />
      ) : cell.revealed && cell.count > 0 ? (
        <span style={{ color: numberColors[cell.count] }}>{cell.count}</span>
      ) : (
        ''
      )}
    </Button>
  );
}
