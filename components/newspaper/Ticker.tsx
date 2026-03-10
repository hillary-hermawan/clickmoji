"use client";

import { STOCKS, EMOJI_STOCKS } from "@/lib/game-data";

interface TickerProps {
  emojiMode: boolean;
}

export default function Ticker({ emojiMode }: TickerProps) {
  const parts = STOCKS.map((s) => {
    const cls = s.up ? "tick-up" : "tick-down";
    const arrow = s.up ? "▲" : "▼";
    const sym = emojiMode ? EMOJI_STOCKS[s.sym] || s.sym : s.sym;
    return (
      <span key={s.sym}>
        <span className={cls}>
          {sym} {arrow}
          {s.pct}%
        </span>
        {" \u00B7 "}
      </span>
    );
  });

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        <div className="ticker-in">
          {parts}
          {parts}
        </div>
      </div>
    </div>
  );
}
