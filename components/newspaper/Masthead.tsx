"use client";

import { useState, useEffect } from "react";
import { FAKE_WEATHER, EDITIONS } from "@/lib/game-data";

interface MastheadProps {
  emojiMode: boolean;
  onToggleMode: (mode: "english" | "emoji") => void;
}

export default function Masthead({ emojiMode, onToggleMode }: MastheadProps) {
  const [dateStr, setDateStr] = useState("");
  const [weather, setWeather] = useState({ emoji: "🌤️", text: "72°F, Existential" });
  const [edition, setEdition] = useState("Late Edition");

  useEffect(() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setDateStr(d.toLocaleDateString("en-US", opts));
    setWeather(FAKE_WEATHER[Math.floor(Math.random() * FAKE_WEATHER.length)]);
    setEdition(EDITIONS[Math.floor(Math.random() * EDITIONS.length)]);
  }, []);

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <div className="masthead-side">
          <div className="masthead-date">
            {emojiMode ? "📅☀️🗓️" : dateStr}
          </div>
          <div className="weather">
            {emojiMode ? (
              <>
                <span className="weather-emoji">🌡️</span>
                <span className="weather-text">🔥❄️🤷</span>
              </>
            ) : (
              <>
                <span className="weather-emoji">{weather.emoji}</span>
                <span className="weather-text">{weather.text}</span>
              </>
            )}
          </div>
        </div>
        <div className="masthead-center">
          <div className="lang-toggle">
            <span
              className={`lang-option ${!emojiMode ? "active" : ""}`}
              onClick={() => onToggleMode("english")}
            >
              English
            </span>
            <span className="lang-sep">|</span>
            <span
              className={`lang-option ${emojiMode ? "active" : ""}`}
              onClick={() => onToggleMode("emoji")}
            >
              Emoji <span className="beta-badge">BETA</span>
            </span>
          </div>
          <div className="masthead-title">
            {emojiMode ? "👆😀📰" : "CLICKMOJI"}
          </div>
          <div className="masthead-motto">
            {emojiMode
              ? '"🏆👆😀📰, 🚫➡️💀"'
              : '"Pioneers of Emoji-First Journalism, Unless It Fails"'}
          </div>
        </div>
        <div className="masthead-side right">
          <div className="edition">{emojiMode ? "🌙📰" : edition}</div>
          <div>{emojiMode ? "📚 · · · 📄" : "Vol. CXLVII · · · No. 51,247"}</div>
        </div>
      </div>
      <div className="masthead-rule">
        <div className="masthead-rule-line" />
      </div>
    </header>
  );
}
