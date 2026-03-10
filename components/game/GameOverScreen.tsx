"use client";

import { useMemo } from "react";
import { getRL, shuffle } from "@/lib/game-logic";
import { GAME_OVER_HEADLINES } from "@/lib/game-data";
import { launchConfetti } from "@/lib/emoji-react";
import type { Headline } from "@/types/game";

interface GameOverScreenProps {
  roundsCompleted: number;
  playerName: string;
  lastQuestion: Headline | null;
  lastCorrectH: string;
  lastChosenH: string;
  isWin: boolean;
  onRestart: () => void;
}

export default function GameOverScreen({
  roundsCompleted,
  playerName,
  lastQuestion,
  lastCorrectH,
  lastChosenH,
  isWin,
  onRestart,
}: GameOverScreenProps) {
  const headline = useMemo(() => {
    if (isWin) return null;
    return shuffle(GAME_OVER_HEADLINES)[0];
  }, [isWin]);

  const title = getRL(roundsCompleted);

  const label = isWin
    ? "\u2014 BREAKING \u2014"
    : headline?.label || "\u2014 CORRECTION \u2014";

  const big = isWin
    ? `Translation Desk History Made by One ${playerName}`
    : typeof headline?.big === "function"
      ? headline.big(playerName)
      : headline?.big || "We Regret the Error";

  const sub = isWin
    ? "In a historic first, all 50 emoji sequences translated without a single error."
    : headline?.sub(playerName) || "";

  return (
    <div className="card gow">
      <div className="golbl">{label}</div>
      <div className="gobig">{big}</div>
      <div className="go-sub-text">{sub}</div>

      {!isWin && lastQuestion && (
        <div className="gorev">
          <div className="goemoji">{lastQuestion.e.join(" ")}</div>
          <div className="gohl">{lastCorrectH}</div>
          <div className="gopw">
            You matched: <span>{lastChosenH}</span>
          </div>
        </div>
      )}

      <div className="fsw">
        <div className="fsv">{isWin ? 50 : roundsCompleted}</div>
      </div>
      <div className="verd">{isWin ? "CHIEF EMOJI OFFICER" : title}</div>

      <div className="go-progress">
        <div
          style={{
            height: 4,
            background: "rgba(0,0,0,.08)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            className="go-progress-bar"
            style={{ width: `${(isWin ? 50 : roundsCompleted) / 50 * 100}%` }}
          />
        </div>
      </div>

      <button className="btnp" onClick={onRestart}>
        {isWin ? "Keep training" : "Clock back in"} &#x23CE;
      </button>

      {isWin && (
        <div style={{ marginTop: 10 }}>
          <span
            className="card-restart"
            style={{ marginLeft: 0 }}
            onClick={() => launchConfetti()}
          >
            &#x2728; Celebrate me, {playerName}, again
          </span>
        </div>
      )}
    </div>
  );
}
