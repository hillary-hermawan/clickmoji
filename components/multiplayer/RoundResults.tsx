"use client";

import Avatar from "@/components/game/Avatar";
import { ROUND_REACTION_EMOJIS } from "@/lib/game-data";
import type { Player } from "@/types/game";

interface RoundResultsProps {
  roundNum: number;
  totalRounds: number;
  correctHeadline: string;
  players: Player[];
  isHotTake: boolean;
  onReaction: (emoji: string) => void;
  countdown: number;
}

export default function RoundResults({
  roundNum,
  totalRounds,
  correctHeadline,
  players,
  isHotTake,
  onReaction,
  countdown,
}: RoundResultsProps) {
  // Sort players by score descending
  const sorted = [...players].sort((a, b) => b.score - a.score);

  // Per-round results sorted by points earned (descending)
  const roundResults = [...players]
    .filter((p) => p.currentRoundAnswer)
    .sort(
      (a, b) =>
        (b.currentRoundAnswer?.pointsEarned || 0) -
        (a.currentRoundAnswer?.pointsEarned || 0)
    );

  return (
    <div className="card gow">
      <div className="golbl">
        {isHotTake
          ? `\u2014 HOT TAKE: ROUND ${roundNum} OF ${totalRounds} \u2014`
          : `\u2014 DISPATCH: ROUND ${roundNum} OF ${totalRounds} \u2014`}
      </div>

      {/* Correct answer */}
      <div
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: 14,
          fontWeight: 700,
          margin: "8px 0 16px",
          padding: "8px 12px",
          background: "rgba(27, 107, 42, 0.06)",
          border: "1px solid rgba(27, 107, 42, 0.15)",
        }}
      >
        <span style={{ color: "var(--green)" }}>&#10003;</span>{" "}
        {correctHeadline}
      </div>

      {/* Per-player results */}
      <div style={{ marginBottom: 16 }}>
        {roundResults.map((p) => {
          const ans = p.currentRoundAnswer!;
          return (
            <div
              key={p.uid}
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
                emoji={p.avatar?.emoji || "🎯"}
                bgColor={p.avatar?.bgColor || "#2196F3"}
                size={24}
              />
              <span
                style={{
                  fontWeight: 700,
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {p.playerName}
              </span>
              <span
                style={{
                  color: ans.correct ? "var(--green)" : "var(--red)",
                  fontWeight: 700,
                }}
              >
                {ans.chosen === null
                  ? "⏱️"
                  : ans.correct
                    ? "✓"
                    : "✗"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 11,
                  color:
                    ans.pointsEarned > 0
                      ? "var(--green)"
                      : ans.pointsEarned < 0
                        ? "var(--red)"
                        : "var(--mt)",
                  minWidth: 60,
                  textAlign: "right",
                }}
              >
                {ans.pointsEarned > 0 ? "+" : ""}
                {ans.pointsEarned.toLocaleString()}
              </span>
              {ans.correct && (
                <span
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 10,
                    color: "var(--mt)",
                    minWidth: 40,
                    textAlign: "right",
                  }}
                >
                  {(ans.timeMs / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Standings */}
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
        Current Standings
      </div>
      {sorted.map((p, i) => (
        <div
          key={p.uid}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 0",
            fontSize: 12,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 11,
              color: "var(--mt)",
              width: 16,
            }}
          >
            {i + 1}.
          </span>
          <Avatar
            emoji={p.avatar?.emoji || "🎯"}
            bgColor={p.avatar?.bgColor || "#2196F3"}
            size={20}
          />
          <span style={{ fontWeight: 700, flex: 1, textAlign: "left" }}>
            {p.playerName}
          </span>
          <span
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {p.score.toLocaleString()} pts
          </span>
          {p.streak >= 3 && (
            <span>{p.streak >= 5 ? "🔥🔥" : "🔥"}</span>
          )}
        </div>
      ))}

      {/* Reactions */}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        {ROUND_REACTION_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onReaction(emoji)}
            style={{
              fontSize: 20,
              background: "none",
              border: "1px solid var(--bd)",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              transition: "transform 0.1s",
            }}
            onMouseDown={(e) =>
              ((e.target as HTMLElement).style.transform = "scale(1.2)")
            }
            onMouseUp={(e) =>
              ((e.target as HTMLElement).style.transform = "scale(1)")
            }
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Countdown */}
      <div
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: 11,
          color: "var(--mt)",
          marginTop: 12,
          letterSpacing: 0.5,
        }}
      >
        Next round in {countdown}...
      </div>
    </div>
  );
}
