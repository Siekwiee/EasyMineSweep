# EasyMineSweep

Modern Minesweeper built with React, TypeScript, Vite, Material UI, and TanStack Router.

This project implements a classic Minesweeper with a clean UI, difficulty presets, first-click safety, flagging, and a straightforward game loop. It is designed as a small, readable codebase showcasing component-driven UI and clear game logic.

## Features

- Difficulty presets: easy (9x9, 10 mines), medium (16x16, 40 mines), hard (16x30, 99 mines)
- First-click safe: the first revealed cell and its neighbors are guaranteed safe
- Reveal and flag modes, plus right-click to flag
- Win/lose detection with simple alerts
- Responsive grid UI using Material UI
- Type-safe state and logic in TypeScript

## Tech Stack

- React 19 + TypeScript
- Vite 6 for dev/build/preview
- Material UI (MUI) for UI components
- TanStack Router for routing and devtools
- Vitest + Testing Library (DOM/React) for tests

## Getting Started

Requirements:

- Node.js 18+ (Node 20+ recommended)
- npm (or a compatible package manager)

Clone and install:

```bash
git clone <your-repo-url>
cd EasyMineSweep/EasyMineSweep
npm install
```

Run the app in development mode:

```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run serve
```

Run tests:

```bash
npm test
```

## How to Play

- Select a difficulty, then press Play in the title bar
- Left click a cell to reveal
- Right click a cell to toggle a flag
- You win when all non-mine cells are revealed
- You lose if you reveal a mine

## Game Logic Overview

Key source files:

- `src/components/game/game.logic.ts` – core game state and actions
- `src/components/game/game.tsx` – game container and controls
- `src/components/board/board.tsx` – renders the grid
- `src/components/cell/cell.tsx` – renders a single cell
- `src/components/title-bar/title-bar.tsx` – title, difficulty selector, and Play button

State shape (`BoardState`):

- `rows`, `cols`, `mines`
- `grid: Cell[][]` where each `Cell` has `{ r, c, mine, revealed, flagged, count }`
- `status: 'playing' | 'won' | 'lost'`
- `flags`, `revealedCount`, `firstClickSafe`

Logic highlights:

- `createGame(rows, cols, mines)` creates an empty board and defers mine placement
- On the first reveal, mines are placed excluding the clicked cell and its 8 neighbors (first-click safety)
- Each cell’s `count` is computed as the number of adjacent mines
- `revealCell(state, r, c)` performs an iterative flood reveal for zero-count regions and checks for win/lose
- `toggleFlag(state, r, c)` toggles flags and updates the remaining indicator

## Scripts

From `EasyMineSweep/EasyMineSweep`:

- `npm run dev` – start dev server on port 3000
- `npm start` – alias for dev
- `npm run build` – build with Vite and TypeScript
- `npm run serve` – preview the production build
- `npm test` – run unit tests (Vitest)

## Project Structure (selected)

```
EasyMineSweep/
  EasyMineSweep/
    src/
      components/
        board/
        cell/
        game/
        title-bar/
      routes/
      main.tsx
      styles.css
    index.html
    package.json
```

## Notes

- The router devtools are enabled by default and render at the root for convenience.
- The project is private and does not include a license declaration. Add a license if you plan to distribute.
