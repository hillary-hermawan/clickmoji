export interface Headline {
  h: string;
  e: string[];
}

export interface Ad {
  cat: string;
  t: string;
  sub: string;
  em: string;
  cta: string;
}

export interface Stock {
  sym: string;
  pct: string;
  up: boolean;
}

export interface Weather {
  emoji: string;
  text: string;
}

export interface GameOverHeadline {
  label: string;
  big: string | ((name: string) => string);
  sub: (name: string) => string;
}

export type GameScreen = "start" | "game" | "gameover";

export interface GameState {
  score: number;
  streak: number;
  best: number;
  q: number;
  used: string[];
  cur: Headline | null;
  timeLeft: number;
}

export interface QuestionPick {
  cor: Headline;
  opts: Headline[];
}

// Multiplayer types

export interface GameSettings {
  rounds: number;
  timerSeconds: number;
  penaltyEnabled: boolean;
  penaltyPoints: number;
  scoreFloorEnabled: boolean;
  scoreFloor: number;
  hotTakeRounds: number[];
  difficultyScaling: boolean;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  rounds: 10,
  timerSeconds: 15,
  penaltyEnabled: true,
  penaltyPoints: 200,
  scoreFloorEnabled: false,
  scoreFloor: 0,
  hotTakeRounds: [5, 8],
  difficultyScaling: false,
};

export interface Avatar {
  emoji: string;
  bgColor: string;
}

export interface RoundAnswer {
  chosen: string | null;
  correct: boolean;
  answeredAt: Date | null;
  timeMs: number;
  pointsEarned: number;
}

export interface RoundHistoryEntry {
  round: number;
  chosen: string | null;
  correct: boolean;
  timeMs: number;
  pointsEarned: number;
}

export interface Room {
  id: string;
  code: string;
  status: "waiting" | "countdown" | "playing" | "finished";
  hostSessionId: string;
  seed: number;
  maxPlayers: number;
  currentRound: number;
  roundPhase: "question" | "results" | null;
  roundStartedAt: Date | null;
  settings: GameSettings;
  createdAt: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
}

export interface Player {
  uid: string;
  playerName: string;
  isHost: boolean;
  avatar: Avatar;
  score: number;
  streak: number;
  bestStreak: number;
  currentRoundAnswer: RoundAnswer | null;
  roundHistory: RoundHistoryEntry[];
  joinedAt: Date;
}

export interface MvpAward {
  title: string;
  playerName: string;
  avatar: Avatar;
  stat: string;
}

export interface Score {
  playerName: string;
  roundsSurvived: number;
  gameMode: "solo" | "multiplayer";
  roomId: string | null;
  playedAt: Date;
}

export interface MultiplayerWinnerHeadline {
  big: (name: string) => string;
  sub: (name: string) => string;
}

export interface PhotoFinishHeadline {
  big: string;
  sub: (winner: string, loser: string, diff: number) => string;
}
