import { describe, it, expect } from "vitest";
import {
  CL,
  ALL,
  ADS,
  STOCKS,
  FAKE_NAMES,
  FAKE_WEATHER,
  GAME_OVER_HEADLINES,
  EDITIONS,
  NAV_SECTIONS,
  EMOJI_NAV,
  EMOJI_STOCKS,
  REACT_EMOJIS,
  TREND_ITEMS,
  AVATAR_EMOJIS,
  AVATAR_COLORS,
  MP_WINNER_HEADLINES,
  PHOTO_FINISH_HEADLINES,
  ROUND_REACTION_EMOJIS,
} from "@/lib/game-data";

describe("headline data integrity", () => {
  it("has 8 categories", () => {
    expect(CL).toHaveLength(8);
  });

  it("ALL contains the flattened total of all category headlines", () => {
    const total = CL.reduce((sum, cat) => sum + cat.length, 0);
    expect(ALL).toHaveLength(total);
  });

  it("every headline has non-empty h and e array with 5 emojis", () => {
    ALL.forEach((headline) => {
      expect(headline.h.length).toBeGreaterThan(0);
      expect(headline.e).toHaveLength(5);
    });
  });

  it("all headline texts are unique", () => {
    const texts = ALL.map((h) => h.h);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("has enough headlines for a full 50-round game", () => {
    expect(ALL.length).toBeGreaterThanOrEqual(50);
  });

  it("each category has at least 4 headlines (enough for distractor picking)", () => {
    CL.forEach((cat) => {
      expect(cat.length).toBeGreaterThanOrEqual(4);
    });
  });
});

describe("ads data", () => {
  it("has at least 5 entries", () => {
    expect(ADS.length).toBeGreaterThanOrEqual(5);
  });

  it("every ad has all required fields", () => {
    ADS.forEach((ad) => {
      expect(ad.cat).toBeTruthy();
      expect(ad.t).toBeTruthy();
      expect(ad.sub).toBeTruthy();
      expect(ad.em).toBeTruthy();
      expect(ad.cta).toBeTruthy();
    });
  });
});

describe("stocks data", () => {
  it("all stocks have sym, pct, and up fields", () => {
    STOCKS.forEach((s) => {
      expect(s.sym).toBeTruthy();
      expect(s.pct).toBeTruthy();
      expect(typeof s.up).toBe("boolean");
    });
  });

  it("every stock symbol has an emoji equivalent", () => {
    STOCKS.forEach((s) => {
      expect(EMOJI_STOCKS[s.sym]).toBeTruthy();
    });
  });
});

describe("fake names", () => {
  it("has at least 10 entries", () => {
    expect(FAKE_NAMES.length).toBeGreaterThanOrEqual(10);
  });

  it("all names are non-empty strings", () => {
    FAKE_NAMES.forEach((name) => {
      expect(name.length).toBeGreaterThan(0);
    });
  });
});

describe("weather data", () => {
  it("has at least 5 entries", () => {
    expect(FAKE_WEATHER.length).toBeGreaterThanOrEqual(5);
  });

  it("every entry has emoji and text", () => {
    FAKE_WEATHER.forEach((w) => {
      expect(w.emoji).toBeTruthy();
      expect(w.text).toBeTruthy();
    });
  });
});

describe("game over headlines", () => {
  it("has at least 3 entries", () => {
    expect(GAME_OVER_HEADLINES.length).toBeGreaterThanOrEqual(3);
  });

  it("all sub functions are callable and return non-empty strings", () => {
    GAME_OVER_HEADLINES.forEach((h) => {
      expect(typeof h.sub).toBe("function");
      const result = h.sub("TestPlayer");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  it("all big values resolve to non-empty strings", () => {
    GAME_OVER_HEADLINES.forEach((h) => {
      const result = typeof h.big === "function" ? h.big("TestPlayer") : h.big;
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe("navigation and emoji mappings", () => {
  it("NAV_SECTIONS has entries", () => {
    expect(NAV_SECTIONS.length).toBeGreaterThanOrEqual(3);
  });

  it("every nav section has an emoji equivalent", () => {
    NAV_SECTIONS.forEach((section) => {
      expect(EMOJI_NAV[section]).toBeTruthy();
    });
  });

  it("EDITIONS has entries", () => {
    expect(EDITIONS.length).toBeGreaterThanOrEqual(3);
  });

  it("REACT_EMOJIS has entries for floating reactions", () => {
    expect(REACT_EMOJIS.length).toBeGreaterThanOrEqual(5);
  });

  it("TREND_ITEMS has at least 5 entries for Most Read section", () => {
    expect(TREND_ITEMS.length).toBeGreaterThanOrEqual(5);
  });
});

/* ─── Multiplayer Data ─── */

describe("avatar data", () => {
  it("AVATAR_EMOJIS has at least 10 entries", () => {
    expect(AVATAR_EMOJIS.length).toBeGreaterThanOrEqual(10);
  });

  it("AVATAR_COLORS has at least 6 entries", () => {
    expect(AVATAR_COLORS.length).toBeGreaterThanOrEqual(6);
  });

  it("all avatar colors are valid hex colors", () => {
    AVATAR_COLORS.forEach((c) => {
      expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

describe("multiplayer winner headlines", () => {
  it("has at least 3 entries", () => {
    expect(MP_WINNER_HEADLINES.length).toBeGreaterThanOrEqual(3);
  });

  it("big and sub are callable functions returning non-empty strings", () => {
    MP_WINNER_HEADLINES.forEach((h) => {
      const big = h.big("TestPlayer");
      const sub = h.sub("TestPlayer");
      expect(big.length).toBeGreaterThan(0);
      expect(sub.length).toBeGreaterThan(0);
    });
  });

  it("headlines include the player name", () => {
    MP_WINNER_HEADLINES.forEach((h) => {
      const big = h.big("Ziggy");
      expect(big).toContain("Ziggy");
    });
  });
});

describe("photo finish headlines", () => {
  it("has at least 2 entries", () => {
    expect(PHOTO_FINISH_HEADLINES.length).toBeGreaterThanOrEqual(2);
  });

  it("big is a non-empty string", () => {
    PHOTO_FINISH_HEADLINES.forEach((h) => {
      expect(h.big.length).toBeGreaterThan(0);
    });
  });

  it("sub is callable and returns string with both player names", () => {
    PHOTO_FINISH_HEADLINES.forEach((h) => {
      const result = h.sub("Alice", "Bob", 42);
      expect(result).toContain("Alice");
      expect(result).toContain("Bob");
    });
  });
});

describe("round reaction emojis", () => {
  it("has exactly 5 emojis", () => {
    expect(ROUND_REACTION_EMOJIS).toHaveLength(5);
  });

  it("all entries are non-empty strings", () => {
    ROUND_REACTION_EMOJIS.forEach((e) => {
      expect(e.length).toBeGreaterThan(0);
    });
  });
});
