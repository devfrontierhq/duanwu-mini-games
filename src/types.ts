export type Arrow = '↑' | '↓' | '←' | '→';
export type HitQuality = 'perfect' | 'good' | 'miss';

// 'playing' covers both arrow-input and spacebar-timing within a single round
export type GamePhase = 'start' | 'playing' | 'feedback' | 'stageclear' | 'gameover';

export interface GameState {
  phase: GamePhase;
  score: number;
  combo: number;
  maxCombo: number;
  timeLeft: number;
  boatProgress: number;
  sequence: Arrow[];
  inputIndex: number;
  sequenceDone: boolean; // all arrows entered — SPACE becomes valid
  roundCount: number;
  wrongKey: boolean;
  feedbackType: HitQuality | null;
  feedbackPoints: number;
  isWin: boolean;
  stage: number;
  driftPaused: boolean;
  paused: boolean;
}

export interface ScoreEntry {
  name: string;
  score: number;
  maxCombo: number;
  date: string;
}
