import { describe, it, expect } from "vitest";
import {
  mulberry32,
  shuffle,
  getSC,
  getTL,
  getRL,
  getRLC,
  pickQuestion,
  initialGameState,
  calculateRoundScore,
  calculateMvpAwards,
  ROOM_CODE_WORDS,
  generateRoomCode,
} from "@/lib/game-logic";
import type { Player, Avatar } from "@/types/game";

describe("mulberry32 (seeded PRNG)", () => {
  it("returns deterministic sequence for a given seed", () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it("returns values in [0, 1) range", () => {
    const rng = mulberry32(12345);
    const vals = Array.from({ length: 1000 }, () => rng());
    vals.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    });
  });

  it("produces different sequences for different seeds", () => {
    const rng1 = mulberry32(1);
    const rng2 = mulberry32(2);
    const seq1 = Array.from({ length: 5 }, () => rng1());
    const seq2 = Array.from({ length: 5 }, () => rng2());
    expect(seq1).not.toEqual(seq2);
  });
});

describe("shuffle", () => {
  it("returns array of same length with same elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result).toHaveLength(5);
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate the original array", () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(copy);
  });

  it("produces deterministic output with seeded rng", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const r1 = shuffle(arr, mulberry32(42));
    const r2 = shuffle(arr, mulberry32(42));
    expect(r1).toEqual(r2);
  });

  it("handles empty array", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("handles single-element array", () => {
    expect(shuffle([1])).toEqual([1]);
  });
});

describe("getSC (same-category distractor count)", () => {
  it("returns 0 for rounds 1-5", () => {
    for (let q = 1; q <= 5; q++) expect(getSC(q)).toBe(0);
  });

  it("returns 1 for rounds 6-10", () => {
    for (let q = 6; q <= 10; q++) expect(getSC(q)).toBe(1);
  });

  it("returns 2 for rounds 11-15", () => {
    for (let q = 11; q <= 15; q++) expect(getSC(q)).toBe(2);
  });

  it("returns 3 for rounds 16+", () => {
    expect(getSC(16)).toBe(3);
    expect(getSC(50)).toBe(3);
    expect(getSC(100)).toBe(3);
  });
});

describe("getTL (timer length in seconds)", () => {
  it("returns 0 (no timer) for rounds 1-10", () => {
    for (let q = 1; q <= 10; q++) expect(getTL(q)).toBe(0);
  });

  it("returns 20 for rounds 11-15", () => {
    for (let q = 11; q <= 15; q++) expect(getTL(q)).toBe(20);
  });

  it("returns 16 for rounds 16-20", () => {
    for (let q = 16; q <= 20; q++) expect(getTL(q)).toBe(16);
  });

  it("returns 13 for rounds 21-30", () => {
    for (let q = 21; q <= 30; q++) expect(getTL(q)).toBe(13);
  });

  it("returns 11 for rounds 31-40", () => {
    for (let q = 31; q <= 40; q++) expect(getTL(q)).toBe(11);
  });

  it("returns 9 for rounds 41+", () => {
    expect(getTL(41)).toBe(9);
    expect(getTL(50)).toBe(9);
  });

  it("timer duration never increases as rounds progress", () => {
    let prev = Infinity;
    for (let q = 11; q <= 50; q++) {
      const tl = getTL(q);
      expect(tl).toBeLessThanOrEqual(prev);
      prev = tl;
    }
  });
});

describe("getRL (rank label)", () => {
  it("returns INTERN for rounds 1-5", () => {
    for (let q = 1; q <= 5; q++) expect(getRL(q)).toBe("INTERN");
  });

  it("returns JUNIOR ASSOCIATE for rounds 6-12", () => {
    for (let q = 6; q <= 12; q++) expect(getRL(q)).toBe("JUNIOR ASSOCIATE");
  });

  it("returns MID-LEVEL TRANSLATOR for rounds 13-20", () => {
    for (let q = 13; q <= 20; q++)
      expect(getRL(q)).toBe("MID-LEVEL TRANSLATOR");
  });

  it("returns SENIOR EMOJI CORRESPONDENT for rounds 21-30", () => {
    for (let q = 21; q <= 30; q++)
      expect(getRL(q)).toBe("SENIOR EMOJI CORRESPONDENT");
  });

  it("returns VP OF TRANSLATION for rounds 31-40", () => {
    for (let q = 31; q <= 40; q++)
      expect(getRL(q)).toBe("VP OF TRANSLATION");
  });

  it("returns CHIEF EMOJI OFFICER for rounds 41+", () => {
    expect(getRL(41)).toBe("CHIEF EMOJI OFFICER");
    expect(getRL(50)).toBe("CHIEF EMOJI OFFICER");
  });
});

describe("getRLC (rank label color)", () => {
  it("returns green for rounds 1-12", () => {
    for (let q = 1; q <= 12; q++) expect(getRLC(q)).toBe("var(--green)");
  });

  it("returns gold for rounds 13-30", () => {
    for (let q = 13; q <= 30; q++) expect(getRLC(q)).toBe("var(--gold)");
  });

  it("returns orange for rounds 31-40", () => {
    for (let q = 31; q <= 40; q++) expect(getRLC(q)).toBe("var(--orange)");
  });

  it("returns red for rounds 41+", () => {
    for (let q = 41; q <= 50; q++) expect(getRLC(q)).toBe("var(--red)");
  });
});

describe("pickQuestion", () => {
  it("returns an object with cor and opts (4 options)", () => {
    const result = pickQuestion([], 1);
    expect(result).toHaveProperty("cor");
    expect(result).toHaveProperty("opts");
    expect(result.opts).toHaveLength(4);
  });

  it("correct answer is always among options", () => {
    for (let i = 0; i < 20; i++) {
      const result = pickQuestion([], i + 1);
      expect(result.opts.some((o) => o.h === result.cor.h)).toBe(true);
    }
  });

  it("does not repeat already-used headlines", () => {
    const used: string[] = [];
    for (let i = 0; i < 30; i++) {
      const result = pickQuestion(used, i + 1);
      expect(used).not.toContain(result.cor.h);
      used.push(result.cor.h);
    }
  });

  it("all 4 options have unique headlines", () => {
    for (let i = 0; i < 20; i++) {
      const result = pickQuestion([], i + 1);
      const headlines = result.opts.map((o) => o.h);
      expect(new Set(headlines).size).toBe(4);
    }
  });

  it("produces deterministic results with seeded rng", () => {
    const r1 = pickQuestion([], 5, mulberry32(42));
    const r2 = pickQuestion([], 5, mulberry32(42));
    expect(r1.cor.h).toBe(r2.cor.h);
    expect(r1.opts.map((o) => o.h)).toEqual(r2.opts.map((o) => o.h));
  });

  it("can generate 50 unique questions without error", () => {
    const used: string[] = [];
    for (let i = 0; i < 50; i++) {
      const result = pickQuestion(used, i + 1);
      expect(result.cor).toBeDefined();
      expect(result.opts).toHaveLength(4);
      used.push(result.cor.h);
    }
    expect(new Set(used).size).toBe(50);
  });
});

describe("initialGameState", () => {
  it("returns a fresh game state with zeroed values", () => {
    const s = initialGameState();
    expect(s.score).toBe(0);
    expect(s.streak).toBe(0);
    expect(s.best).toBe(0);
    expect(s.q).toBe(0);
    expect(s.used).toEqual([]);
    expect(s.cur).toBeNull();
    expect(s.timeLeft).toBe(0);
  });

  it("returns a new object each time (not shared reference)", () => {
    const s1 = initialGameState();
    const s2 = initialGameState();
    expect(s1).not.toBe(s2);
    expect(s1.used).not.toBe(s2.used);
  });
});

/* ─── Multiplayer Scoring ─── */

describe("calculateRoundScore", () => {
  const baseParams = {
    correct: true,
    timeMs: 5000,
    timerSeconds: 15,
    streak: 1,
    isHotTake: false,
    penaltyEnabled: true,
    penaltyPoints: 200,
    scoreFloorEnabled: false,
    scoreFloor: 0,
    currentScore: 0,
  };

  it("awards 1000 base points for correct answer", () => {
    const score = calculateRoundScore({
      ...baseParams,
      timeMs: 15000, // no time remaining
      streak: 0,
    });
    // base=1000, speed=0 (no time left), streak=0
    expect(score).toBe(1000);
  });

  it("awards speed bonus based on time remaining", () => {
    const fast = calculateRoundScore({
      ...baseParams,
      timeMs: 0, // instant answer
      streak: 0,
    });
    // base=1000, speed=500 (full time remaining)
    expect(fast).toBe(1500);
  });

  it("awards speed bonus linearly", () => {
    const halfTime = calculateRoundScore({
      ...baseParams,
      timeMs: 7500, // half of 15s
      streak: 0,
    });
    // base=1000, speed=250 (half time remaining)
    expect(halfTime).toBe(1250);
  });

  it("awards streak bonus capped at 500", () => {
    const streak3 = calculateRoundScore({
      ...baseParams,
      timeMs: 15000,
      streak: 3,
    });
    expect(streak3).toBe(1300); // 1000 + 0 + 300

    const streak10 = calculateRoundScore({
      ...baseParams,
      timeMs: 15000,
      streak: 10,
    });
    expect(streak10).toBe(1500); // 1000 + 0 + 500 (capped)
  });

  it("doubles points for hot take rounds", () => {
    const normal = calculateRoundScore({
      ...baseParams,
      timeMs: 15000,
      streak: 0,
      isHotTake: false,
    });
    const hotTake = calculateRoundScore({
      ...baseParams,
      timeMs: 15000,
      streak: 0,
      isHotTake: true,
    });
    expect(hotTake).toBe(normal * 2);
  });

  it("returns negative penalty for wrong answer", () => {
    const score = calculateRoundScore({
      ...baseParams,
      correct: false,
      penaltyEnabled: true,
      penaltyPoints: 200,
    });
    expect(score).toBe(-200);
  });

  it("returns 0 for wrong answer when penalty disabled", () => {
    const score = calculateRoundScore({
      ...baseParams,
      correct: false,
      penaltyEnabled: false,
    });
    expect(score).toBe(0);
  });

  it("respects score floor when enabled", () => {
    const score = calculateRoundScore({
      ...baseParams,
      correct: false,
      penaltyEnabled: true,
      penaltyPoints: 200,
      scoreFloorEnabled: true,
      scoreFloor: 0,
      currentScore: 100,
    });
    // Floor is 0, current is 100, penalty is -200
    // Max allowed loss = 0 - 100 = -100
    expect(score).toBe(-100);
  });

  it("allows full penalty when score is high enough above floor", () => {
    const score = calculateRoundScore({
      ...baseParams,
      correct: false,
      penaltyEnabled: true,
      penaltyPoints: 200,
      scoreFloorEnabled: true,
      scoreFloor: 0,
      currentScore: 500,
    });
    expect(score).toBe(-200);
  });

  it("allows negative scores when floor is disabled", () => {
    const score = calculateRoundScore({
      ...baseParams,
      correct: false,
      penaltyEnabled: true,
      penaltyPoints: 200,
      scoreFloorEnabled: false,
      currentScore: 50,
    });
    expect(score).toBe(-200);
  });

  it("clamps speed bonus to 0 when timeMs exceeds timer", () => {
    const score = calculateRoundScore({
      ...baseParams,
      timeMs: 20000, // more than 15s timer
      streak: 0,
    });
    expect(score).toBe(1000); // base only
  });
});

/* ─── MVP Awards ─── */

function makePlayer(overrides: Partial<Player> & { uid: string; playerName: string }): Player {
  const defaultAvatar: Avatar = { emoji: "🎯", bgColor: "#2196F3" };
  return {
    isHost: false,
    avatar: defaultAvatar,
    score: 0,
    streak: 0,
    bestStreak: 0,
    currentRoundAnswer: null,
    roundHistory: [],
    joinedAt: new Date(),
    ...overrides,
  };
}

describe("calculateMvpAwards", () => {
  it("returns empty array for empty players", () => {
    expect(calculateMvpAwards([])).toEqual([]);
  });

  it("awards Fastest Typesetter to player with lowest avg correct time", () => {
    const players: Player[] = [
      makePlayer({
        uid: "a",
        playerName: "Alice",
        roundHistory: [
          { round: 1, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1000 },
          { round: 2, chosen: "x", correct: true, timeMs: 3000, pointsEarned: 1000 },
        ],
      }),
      makePlayer({
        uid: "b",
        playerName: "Bob",
        roundHistory: [
          { round: 1, chosen: "x", correct: true, timeMs: 5000, pointsEarned: 1000 },
          { round: 2, chosen: "x", correct: true, timeMs: 6000, pointsEarned: 1000 },
        ],
      }),
    ];

    const awards = calculateMvpAwards(players);
    const fastest = awards.find((a) => a.title === "Fastest Typesetter");
    expect(fastest).toBeDefined();
    expect(fastest!.playerName).toBe("Alice");
  });

  it("awards Longest Press Run to player with highest bestStreak", () => {
    const players: Player[] = [
      makePlayer({ uid: "a", playerName: "Alice", bestStreak: 3 }),
      makePlayer({ uid: "b", playerName: "Bob", bestStreak: 7 }),
    ];

    const awards = calculateMvpAwards(players);
    const streak = awards.find((a) => a.title === "Longest Press Run");
    expect(streak).toBeDefined();
    expect(streak!.playerName).toBe("Bob");
  });

  it("awards Late Edition Surge based on final 3 rounds", () => {
    const players: Player[] = [
      makePlayer({
        uid: "a",
        playerName: "Alice",
        roundHistory: [
          { round: 1, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
          { round: 2, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
          { round: 3, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
          { round: 4, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
          { round: 5, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 100 },
          { round: 6, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 100 },
          { round: 7, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 100 },
          { round: 8, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
          { round: 9, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
          { round: 10, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
        ],
      }),
      makePlayer({
        uid: "b",
        playerName: "Bob",
        roundHistory: [
          { round: 1, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
          { round: 2, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
          { round: 3, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
          { round: 4, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
          { round: 5, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
          { round: 6, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
          { round: 7, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
          { round: 8, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
          { round: 9, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
          { round: 10, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
        ],
      }),
    ];

    const awards = calculateMvpAwards(players);
    const surge = awards.find((a) => a.title === "Late Edition Surge");
    expect(surge).toBeDefined();
    expect(surge!.playerName).toBe("Bob");
  });

  it("does not award Longest Press Run when all streaks are 0", () => {
    const players: Player[] = [
      makePlayer({ uid: "a", playerName: "Alice", bestStreak: 0 }),
      makePlayer({ uid: "b", playerName: "Bob", bestStreak: 0 }),
    ];

    const awards = calculateMvpAwards(players);
    const streak = awards.find((a) => a.title === "Longest Press Run");
    expect(streak).toBeUndefined();
  });

  it("skips Fastest Typesetter when no player has correct answers", () => {
    const players: Player[] = [
      makePlayer({
        uid: "a",
        playerName: "Alice",
        roundHistory: [
          { round: 1, chosen: "x", correct: false, timeMs: 2000, pointsEarned: -200 },
        ],
      }),
    ];

    const awards = calculateMvpAwards(players);
    const fastest = awards.find((a) => a.title === "Fastest Typesetter");
    expect(fastest).toBeUndefined();
  });

  it("returns at most 3 awards", () => {
    const players: Player[] = [
      makePlayer({
        uid: "a",
        playerName: "Alice",
        bestStreak: 5,
        roundHistory: [
          { round: 1, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
          { round: 2, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
          { round: 3, chosen: "x", correct: true, timeMs: 2000, pointsEarned: 1500 },
        ],
      }),
    ];

    const awards = calculateMvpAwards(players);
    expect(awards.length).toBeLessThanOrEqual(3);
  });
});

/* ─── Room Code Generation ─── */

describe("ROOM_CODE_WORDS", () => {
  it("has at least 20 unique words", () => {
    expect(ROOM_CODE_WORDS.length).toBeGreaterThanOrEqual(20);
    expect(new Set(ROOM_CODE_WORDS).size).toBe(ROOM_CODE_WORDS.length);
  });

  it("all words are uppercase", () => {
    ROOM_CODE_WORDS.forEach((w) => {
      expect(w).toBe(w.toUpperCase());
    });
  });

  it("all words are 3-6 characters", () => {
    ROOM_CODE_WORDS.forEach((w) => {
      expect(w.length).toBeGreaterThanOrEqual(3);
      expect(w.length).toBeLessThanOrEqual(6);
    });
  });
});

describe("generateRoomCode", () => {
  it("returns a word from the ROOM_CODE_WORDS list", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateRoomCode();
      expect(ROOM_CODE_WORDS).toContain(code);
    }
  });

  it("produces deterministic output with seeded rng", () => {
    const code1 = generateRoomCode(mulberry32(42));
    const code2 = generateRoomCode(mulberry32(42));
    expect(code1).toBe(code2);
  });
});
