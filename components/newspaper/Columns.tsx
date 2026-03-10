"use client";

import { useState, useEffect } from "react";
import { TREND_ITEMS } from "@/lib/game-data";
import { shuffle } from "@/lib/game-logic";
import { spawnEmojiReact } from "@/lib/emoji-react";

interface ColumnsProps {
  emojiMode: boolean;
}

const DISPATCH_EMOJIS = ["📰", "🔥", "💀", "😬", "👀", "🤔", "📊", "⚡", "🌍", "💸", "😱", "🤯"];

export default function Columns({ emojiMode }: ColumnsProps) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(shuffle(TREND_ITEMS).slice(0, 5));
  }, []);

  const randomEmojiLine = () => {
    const count = Math.floor(Math.random() * 3) + 3;
    return Array.from(
      { length: count },
      () => DISPATCH_EMOJIS[Math.floor(Math.random() * DISPATCH_EMOJIS.length)]
    ).join("");
  };

  return (
    <aside className="col-right">
      <div
        className="col-label"
        onClick={(e) => spawnEmojiReact(e.clientX, e.clientY)}
        style={{ cursor: "pointer" }}
      >
        {emojiMode ? "🔥📖👀" : "Most Read"}
      </div>
      <div>
        {items.map((item, i) => (
          <div
            className="dispatch"
            key={i}
            onClick={(e) => spawnEmojiReact(e.clientX, e.clientY)}
          >
            <span className="d-num">{i + 1}</span>
            {emojiMode ? randomEmojiLine() : item}
          </div>
        ))}
      </div>
    </aside>
  );
}
