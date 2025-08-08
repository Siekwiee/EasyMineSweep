export type Difficulty = 'easy' | 'medium' | 'hard';

export type TitleBarProps = {
  onStart?: (difficulty: Difficulty) => void;
};
