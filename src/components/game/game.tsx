import React from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FlagIcon from '@mui/icons-material/Flag';
import { createGame, revealCell, toggleFlag } from './game.logic';
import Board from '../board/board';
import type { BoardState } from '../board/board.types';



export default function Game({ rows, cols, mines }: Readonly<GameProps>) {
  const [state, setState] = React.useState<BoardState>(() =>
    createGame(rows, cols, mines),
  );
  const [mode, setMode] = React.useState<'reveal' | 'flag'>('reveal');

  const reset = () => setState(createGame(rows, cols, mines));

  React.useEffect(() => {
    setState(createGame(rows, cols, mines));
  }, [rows, cols, mines]);

  const onReveal = (r: number, c: number) =>
    setState((s) => revealCell(s, r, c));

  const onToggleFlag = (r: number, c: number) =>
    setState((s) => toggleFlag(s, r, c));

  const remaining = state.mines - state.flags;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">
            {rows}x{cols} • Mines: {mines}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={reset}
          >
            Reset
          </Button>
          <ToggleButtonGroup
            exclusive
            value={mode}
            onChange={(_, v) => v && setMode(v)}
            size="small"
          >
            <ToggleButton value="reveal">Reveal</ToggleButton>
            <ToggleButton value="flag">
              <FlagIcon fontSize="small" sx={{ mr: 1 }} />
              Flag
            </ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ flexGrow: 1 }} />
        </Stack>

        <Paper
          sx={{
            p: 2,
            display: 'inline-block',
            userSelect: 'none',
            overflowX: 'auto',
          }}
        >
          <Board
            state={state}
            onReveal={(r, c) =>
              mode === 'reveal' ? onReveal(r, c) : onToggleFlag(r, c)
            }
            onRightClick={onToggleFlag}
          />
        </Paper>

        {state.status === 'lost' && (
          <Alert severity="error">Boom! You hit a mine.</Alert>
        )}
        {state.status === 'won' && (
          <Alert severity="success">Nice! You cleared the board.</Alert>
        )}
        <Typography variant="body2" color="text.secondary">
          Flags: {state.flags} • Remaining estimated mines: {remaining}
        </Typography>
      </Stack>
    </Box>
  );
}
