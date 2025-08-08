//Title bar component including: title, restart, and difficulty selector

import {
  Button,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Card,
  CardActions,
  CardContent,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import type { TitleBarProps, Difficulty } from './title-bar.types';

export default function TitleBar({ onStart }: Readonly<TitleBarProps>) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const handleStart = () => {
    if (onStart) onStart(difficulty);
  };

  return (
    <Box
      minHeight="10vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card
        sx={{
          maxWidth: 800,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            Minesweeper Demo
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Left click to reveal, right click to flag. Select difficulty and
            press Play.
          </Typography>
        </CardContent>
        <FormControl sx={{ mt: 2, flexDirection: 'row' }}>
          <InputLabel id="diff-label">Difficulty</InputLabel>
          <Select
            labelId="diff-label"
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <MenuItem value="easy">Easy (9x9, 10 mines)</MenuItem>
            <MenuItem value="medium">Medium (16x16, 40 mines)</MenuItem>
            <MenuItem value="hard">Hard (16x30, 99 mines)</MenuItem>
          </Select>
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button variant="contained" onClick={handleStart}>
              Play
            </Button>
          </CardActions>
        </FormControl>
      </Card>
    </Box>
  );
}
