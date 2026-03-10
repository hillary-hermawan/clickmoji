"use client";

import { useState, useEffect, useCallback } from "react";
import { ADS } from "@/lib/game-data";
import { shuffle } from "@/lib/game-logic";
import { spawnEmojiReact } from "@/lib/emoji-react";
import type { Ad } from "@/types/game";

interface TopAdProps {
  emojiMode: boolean;
  refreshKey: number;
}

export default function TopAd({ emojiMode, refreshKey }: TopAdProps) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    const ads = shuffle(ADS);
    setAd(ads[0]);
  }, [refreshKey]);

  const handleCtaClick = useCallback(
    (e: React.MouseEvent) => {
      spawnEmojiReact(e.clientX, e.clientY);
    },
    []
  );

  if (!ad) return null;

  return (
    <div className="top-ad-wrap">
      <div className="top-ad-label">Advertisement</div>
      <div className="top-ad">
        <span className="top-ad-emoji">{ad.em}</span>
        <div className="top-ad-body">
          <div className="top-ad-title">
            {emojiMode ? "🛒✨💰🔥" : ad.t}
          </div>
          <div className="top-ad-sub">
            {emojiMode ? "👆👆👆 💵➡️😊" : ad.sub}
          </div>
        </div>
        <button className="top-ad-cta" onClick={handleCtaClick}>
          {emojiMode ? "👆" : ad.cta || "Learn more"}
        </button>
      </div>
    </div>
  );
}
