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
} from "@/lib/game-logic";

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
