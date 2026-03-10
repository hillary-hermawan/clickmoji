import { Headline, QuestionPick, GameState } from "@/types/game";
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
