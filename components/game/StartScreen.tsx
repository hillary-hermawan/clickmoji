"use client";

import { useState, useEffect, useRef } from "react";
import { FAKE_NAMES } from "@/lib/game-data";

interface StartScreenProps {
  onStart: (name: string) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)]);
  }, []);

  const regenName = () => {
    let newName = name;
    let attempt = 0;
    while (attempt < 20) {
      const pick = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
      if (pick !== name) {
        newName = pick;
        break;
      }
      attempt++;
    }
    setName(newName);
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const handleStart = () => {
    const playerName =
      name.trim() ||
      FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
    onStart(playerName);
  };

  return (
    <div className="start">
      <div className="start-title">
        Welcome to
        <br />
        Clickmoji&apos;s Translation Desk
      </div>
      <p className="start-sub">
        CLICKMOJI is going emoji-first. As our newest hire, your job is to{" "}
        <strong>
          train our AI by matching emoji sequences to the correct headlines.
        </strong>{" "}
        One wrong match and you&apos;re done for the day.
      </p>
      <div className="badge-wrap">
        <div className="badge-photo">🪪</div>
        <div className="badge-name-row">
          <input
            ref={inputRef}
            type="text"
            className="badge-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            spellCheck={false}
          />
          <span className="name-shuffle" onClick={regenName} title="New name">
            🔀
          </span>
        </div>
        <div className="badge-dept">Translation Desk</div>
        <button className="btnp" onClick={handleStart}>
          Clock in &#x23CE;
        </button>
      </div>
    </div>
  );
}
