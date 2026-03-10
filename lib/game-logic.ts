import { Headline, QuestionPick, GameState, MvpAward, RoundHistoryEntry, Player } from "@/types/game";
import { CL, ALL } from "./game-data";

/* ─── Seeded PRNG (mulberry32) ─── */
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ─── Shuffle with custom random fn ─── */
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Difficulty Scaling ─── */
export function getSC(q: number): number {
  if (q <= 5) return 0;
  if (q <= 10) return 1;
  if (q <= 15) return 2;
  return 3;
}

export function getTL(q: number): number {
  if (q <= 10) return 0;
  if (q <= 15) return 20;
  if (q <= 20) return 16;
  if (q <= 30) return 13;
  if (q <= 40) return 11;
  return 9;
}

export function getRL(q: number): string {
  if (q <= 5) return "INTERN";
  if (q <= 12) return "JUNIOR ASSOCIATE";
  if (q <= 20) return "MID-LEVEL TRANSLATOR";
  if (q <= 30) return "SENIOR EMOJI CORRESPONDENT";
  if (q <= 40) return "VP OF TRANSLATION";
  return "CHIEF EMOJI OFFICER";
}

export function getRLC(q: number): string {
  if (q <= 5) return "var(--green)";
  if (q <= 12) return "var(--green)";
  if (q <= 20) return "var(--gold)";
  if (q <= 30) return "var(--gold)";
  if (q <= 40) return "var(--orange)";
  return "var(--red)";
}

/* ─── Question Generation ─── */
export function pickQuestion(
  used: string[],
  roundNum: number,
  rng: () => number = Math.random
): QuestionPick {
  const av = ALL.filter((x) => !used.includes(x.h));
  const cor = av[Math.floor(rng() * av.length)];

  const corCat = CL.find((c) => c.some((x) => x.h === cor.h))!;
  const sc = getSC(roundNum);

  const same = shuffle(
    corCat.filter((x) => x.h !== cor.h),
    rng
  );
  const diff = shuffle(
    ALL.filter((x) => x.h !== cor.h && !corCat.includes(x)),
    rng
  );

  let dis: Headline[] = [...same.slice(0, sc)];
  dis.push(...diff.slice(0, 3 - dis.length));

  if (dis.length < 3) {
    const ex = shuffle(
      ALL.filter((x) => x.h !== cor.h && !dis.some((d) => d.h === x.h)),
      rng
    );
    dis = [...dis, ...ex].slice(0, 3);
  }

  return { cor, opts: shuffle([cor, ...dis], rng) };
}

/* ─── Initial Game State ─── */
export function initialGameState(): GameState {
  return {
    score: 0,
    streak: 0,
    best: 0,
    q: 0,
    used: [],
    cur: null,
    timeLeft: 0,
  };
}

/* ─── Multiplayer Scoring ─── */
export function calculateRoundScore(params: {
  correct: boolean;
  timeMs: number;
  timerSeconds: number;
  streak: number;
  isHotTake: boolean;
  penaltyEnabled: boolean;
  penaltyPoints: number;
  scoreFloorEnabled: boolean;
  scoreFloor: number;
  currentScore: number;
}): number {
  if (!params.correct) {
    if (!params.penaltyEnabled) return 0;
    const penalty = -params.penaltyPoints;
    if (params.scoreFloorEnabled) {
      return Math.max(params.scoreFloor - params.currentScore, penalty);
    }
    return penalty;
  }

  const timerMs = params.timerSeconds * 1000;
  const timeRemaining = Math.max(0, timerMs - params.timeMs);
  const base = 1000;
  const speed = Math.round(500 * (timeRemaining / timerMs));
  const streakBonus = Math.min(params.streak * 100, 500);
  let total = base + speed + streakBonus;
  if (params.isHotTake) total *= 2;
  return total;
}

/* ─── MVP Awards ─── */
export function calculateMvpAwards(players: Player[]): MvpAward[] {
  const awards: MvpAward[] = [];
  if (players.length === 0) return awards;

  // Fastest Typesetter — lowest avg response time (correct answers only)
  const avgTimes = players
    .map((p) => {
      const correctRounds = p.roundHistory.filter((r) => r.correct);
      if (correctRounds.length === 0) return { player: p, avg: Infinity };
      const avg =
        correctRounds.reduce((sum, r) => sum + r.timeMs, 0) /
        correctRounds.length;
      return { player: p, avg };
    })
    .filter((x) => x.avg !== Infinity)
    .sort((a, b) => a.avg - b.avg);

  if (avgTimes.length > 0) {
    const winner = avgTimes[0];
    awards.push({
      title: "Fastest Typesetter",
      playerName: winner.player.playerName,
      avatar: winner.player.avatar,
      stat: `avg ${(winner.avg / 1000).toFixed(1)}s response time`,
    });
  }

  // Longest Press Run — highest bestStreak
  const streakWinner = [...players].sort(
    (a, b) => b.bestStreak - a.bestStreak
  )[0];
  if (streakWinner.bestStreak > 0) {
    awards.push({
      title: "Longest Press Run",
      playerName: streakWinner.playerName,
      avatar: streakWinner.avatar,
      stat: `${streakWinner.bestStreak} correct in a row`,
    });
  }

  // Late Edition Surge — most points in final 3 rounds
  const finalRoundPoints = players.map((p) => {
    const history = p.roundHistory;
    const totalRounds = history.length;
    const last3 = history.filter((r) => r.round > totalRounds - 3);
    const points = last3.reduce((sum, r) => sum + r.pointsEarned, 0);
    return { player: p, points };
  }).sort((a, b) => b.points - a.points);

  if (finalRoundPoints.length > 0 && finalRoundPoints[0].points > 0) {
    const winner = finalRoundPoints[0];
    awards.push({
      title: "Late Edition Surge",
      playerName: winner.player.playerName,
      avatar: winner.player.avatar,
      stat: `+${winner.points.toLocaleString()} pts in final 3 rounds`,
    });
  }

  return awards;
}

/* ─── Room Code Generation ─── */
export const ROOM_CODE_WORDS = [
  "EMOJI", "ATTN", "CLKBT", "NUANC", "FOMO",
  "FACTS", "VIBES", "OUTRG", "CNTXT", "IRONY", "TAKES",
  "HYPE", "CHAOS", "DRAMA", "TREND", "RUMOR",
  "PANIC", "SCOOP", "BLURB", "GAFFE", "SNARK",
  "CRINGE", "SLAY", "RATIO", "SHADE", "CLOUT",
];

export function generateRoomCode(rng: () => number = Math.random): string {
  return ROOM_CODE_WORDS[Math.floor(rng() * ROOM_CODE_WORDS.length)];
}
