import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import '../App.css';
import TitleBar from '../components/title-bar/title-bar';
import type { Difficulty } from '../components/title-bar/title-bar';
import Game from '../components/game/game';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const config = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 },
  } as const;

  const { rows, cols, mines } = config[difficulty];

  return (
    <>
      <TitleBar onStart={setDifficulty} />
      <Game rows={rows} cols={cols} mines={mines} />
    </>
  );
}
