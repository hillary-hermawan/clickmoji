"use client";

import { NAV_SECTIONS, EMOJI_NAV } from "@/lib/game-data";
import { spawnEmojiReact } from "@/lib/emoji-react";

interface SectionsNavProps {
  emojiMode: boolean;
}

export default function SectionsNav({ emojiMode }: SectionsNavProps) {
  return (
    <nav className="sections-bar">
      <div className="sections-inner">
        {NAV_SECTIONS.map((section, i) => (
          <span key={section}>
            <a
              className={`section-link ${i === 0 ? "active" : ""}`}
              onClick={(e) => spawnEmojiReact(e.clientX, e.clientY)}
            >
              {emojiMode ? EMOJI_NAV[section] || "❓" : section}
            </a>
            {i < NAV_SECTIONS.length - 1 && (
              <span className="section-sep">|</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
