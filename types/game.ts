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
export interface Room {
  id: string;
  code: string;
  status: "waiting" | "playing" | "finished";
  hostSessionId: string;
  seed: number;
  maxPlayers: number;
  createdAt: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
}

export interface Player {
  uid: string;
  playerName: string;
  isHost: boolean;
  currentRound: number;
  isAlive: boolean;
  joinedAt: Date;
  eliminatedAt: Date | null;
}

export interface Score {
  playerName: string;
  roundsSurvived: number;
  gameMode: "solo" | "multiplayer";
  roomId: string | null;
  playedAt: Date;
}
