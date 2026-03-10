"use client";

import { useEffect } from "react";
import Avatar from "@/components/game/Avatar";
import { calculateMvpAwards } from "@/lib/game-logic";
import { MP_WINNER_HEADLINES, PHOTO_FINISH_HEADLINES } from "@/lib/game-data";
import { launchConfetti } from "@/lib/emoji-react";
import type { Player, MvpAward } from "@/types/game";

interface FinalStandingsProps {
  players: Player[];
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

export default function FinalStandings({
  players,
  onPlayAgain,
  onBackToLobby,
}: FinalStandingsProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const runnerUp = sorted[1];

  // Photo finish detection: top 2 within 500 pts
  const isPhotoFinish =
    sorted.length >= 2 &&
    Math.abs(winner.score - runnerUp.score) <= 500;

  const pointDiff = winner ? Math.abs(winner.score - (runnerUp?.score ?? 0)) : 0;

  // Pick headline
  const headlineIdx = Math.floor(Math.random() * MP_WINNER_HEADLINES.length);
  const headline = MP_WINNER_HEADLINES[headlineIdx];

  const photoIdx = Math.floor(Math.random() * PHOTO_FINISH_HEADLINES.length);
  const photoHeadline = PHOTO_FINISH_HEADLINES[photoIdx];

  // MVP awards
  const mvpAwards: MvpAward[] = calculateMvpAwards(players);

  // Confetti on mount
  useEffect(() => {
    launchConfetti();
  }, []);

  return (
    <div className="card gow">
      <div className="golbl">— FINAL EDITION —</div>

      {/* Winner headline */}
      {isPhotoFinish ? (
        <>
          <div className="gobig" style={{ color: "var(--red)" }}>
            {photoHeadline.big}
          </div>
          <div className="gosub">
            {photoHeadline.sub(
              winner.playerName,
              runnerUp.playerName,
              pointDiff
            )}
          </div>
        </>
      ) : (
        <>
          <div className="gobig">{headline.big(winner.playerName)}</div>
          <div className="gosub">{headline.sub(winner.playerName)}</div>
        </>
      )}

      {/* Final leaderboard */}
      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: 10,
            letterSpacing: 1,
            color: "var(--mt)",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Final Standings
        </div>
        {sorted.map((p, i) => (
          <div
            key={p.uid}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 0",
              borderBottom: "1px solid var(--bd)",
              fontSize: 13,
              fontWeight: i === 0 ? 700 : 400,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: 14,
                color: i === 0 ? "var(--gold)" : "var(--mt)",
                width: 24,
                textAlign: "center",
              }}
            >
              {i === 0 ? "👑" : `${i + 1}.`}
            </span>
            <Avatar
              emoji={p.avatar?.emoji || "🎯"}
              bgColor={p.avatar?.bgColor || "#2196F3"}
              size={28}
            />
            <span style={{ flex: 1, textAlign: "left" }}>
              {p.playerName}
            </span>
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {p.score.toLocaleString()} pts
            </span>
            {p.bestStreak >= 3 && (
              <span>{p.bestStreak >= 5 ? "🔥🔥" : "🔥"}</span>
            )}
          </div>
        ))}
      </div>

      {/* MVP Awards — "Staff Commendations" */}
      {mvpAwards.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 10,
              letterSpacing: 1,
              color: "var(--mt)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Staff Commendations
          </div>
          {mvpAwards.map((award) => (
            <div
              key={award.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 0",
                borderBottom: "1px solid var(--bd)",
                fontSize: 12,
              }}
            >
              <Avatar
                emoji={award.avatar.emoji}
                bgColor={award.avatar.bgColor}
                size={22}
              />
              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontFamily: "var(--font-playfair)",
                    fontSize: 13,
                  }}
                >
                  {award.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 10,
                    color: "var(--mt)",
                  }}
                >
                  {award.playerName} — {award.stat}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Per-player round breakdown */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: 10,
            letterSpacing: 1,
            color: "var(--mt)",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Performance Review
        </div>
        {sorted.map((p) => {
          const correctCount = p.roundHistory.filter((r) => r.correct).length;
          const totalRounds = p.roundHistory.length;
          const accuracy =
            totalRounds > 0
              ? Math.round((correctCount / totalRounds) * 100)
              : 0;
          return (
            <div
              key={p.uid}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 0",
                fontSize: 11,
                fontFamily: "var(--font-space-mono)",
              }}
            >
              <Avatar
                emoji={p.avatar?.emoji || "🎯"}
                bgColor={p.avatar?.bgColor || "#2196F3"}
                size={18}
              />
              <span style={{ fontWeight: 700, minWidth: 80, textAlign: "left" }}>
                {p.playerName}
              </span>
              <span style={{ color: "var(--mt)" }}>
                {correctCount}/{totalRounds} correct ({accuracy}%)
              </span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button className="btnp" onClick={onPlayAgain}>
          Play Again
        </button>
        <button
          className="btnp"
          onClick={onBackToLobby}
          style={{
            background: "none",
            border: "1px solid var(--bd)",
            color: "var(--tx)",
          }}
        >
          Back to Lobby
        </button>
      </div>
    </div>
  );
}
