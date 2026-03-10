"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";
import Avatar from "@/components/game/Avatar";
import type { Player, GameSettings } from "@/types/game";
import { DEFAULT_GAME_SETTINGS } from "@/types/game";

interface WaitingRoomProps {
  roomId: string;
  roomCode: string;
  onGameStart: (seed: number, settings: GameSettings) => void;
}

const ROUNDS_OPTIONS = [5, 10, 15, 20];
const TIMER_OPTIONS = [10, 15, 20, 30];

export default function WaitingRoom({
  roomId,
  roomCode,
  onGameStart,
}: WaitingRoomProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Subscribe to players
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "rooms", roomId, "players"),
      (snap) => {
        const ps: Player[] = snap.docs.map((d) => d.data() as Player);
        setPlayers(ps);
        const me = ps.find((p) => p.uid === auth.currentUser?.uid);
        if (me) setIsHost(me.isHost);
      }
    );
    return () => unsub();
  }, [roomId]);

  // Subscribe to room for status changes and settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      const data = snap.data();
      if (!data) return;
      if (data.settings) setSettings(data.settings);
      if (data.status === "playing") {
        onGameStart(data.seed, data.settings || DEFAULT_GAME_SETTINGS);
      }
    });
    return () => unsub();
  }, [roomId, onGameStart]);

  const updateSetting = async (patch: Partial<GameSettings>) => {
    setError("");
    try {
      const res = await fetch(`/api/rooms/${roomId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: auth.currentUser?.uid,
          settings: patch,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const kickPlayer = async (targetUid: string) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/kick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: auth.currentUser?.uid,
          targetUid,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to kick");
    }
  };

  const startGame = async () => {
    setStarting(true);
    setError("");
    // 3-second countdown
    setCountdown(3);
    for (let i = 2; i >= 0; i--) {
      await new Promise((r) => setTimeout(r, 1000));
      setCountdown(i);
    }
    try {
      const res = await fetch(`/api/rooms/${roomId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: auth.currentUser?.uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start");
      setStarting(false);
      setCountdown(null);
    }
  };

  const maxPlayers = settings.rounds ? 4 : 4; // could come from room doc

  // Countdown overlay
  if (countdown !== null && countdown > 0) {
    return (
      <div className="start" style={{ textAlign: "center" }}>
        <div
          className="start-title"
          style={{ fontSize: 72, marginTop: 40, marginBottom: 20 }}
        >
          {countdown}
        </div>
        <p className="start-sub">Interview starting...</p>
      </div>
    );
  }

  const settingLabel: React.CSSProperties = {
    fontFamily: "var(--font-space-mono)",
    fontSize: 10,
    letterSpacing: 1,
    color: "var(--mt)",
    textTransform: "uppercase",
  };

  const selectStyle: React.CSSProperties = {
    fontFamily: "var(--font-space-mono)",
    fontSize: 11,
    padding: "4px 6px",
    border: "1px solid var(--bd)",
    background: "var(--bg)",
    color: "var(--tx)",
    cursor: "pointer",
  };

  return (
    <div className="start" style={{ textAlign: "center" }}>
      <div className="start-title">Editorial Meeting</div>
      <p className="start-sub">Share this code with fellow translators:</p>

      {/* Room code display - ticker style */}
      <div
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: 6,
          margin: "12px 0 20px",
          color: "var(--tx)",
        }}
      >
        {roomCode}
      </div>

      {/* Settings (host editable) */}
      {isHost && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px 16px",
            marginBottom: 16,
            padding: "12px",
            border: "1px solid var(--bd)",
            background: "var(--bg)",
            textAlign: "left",
          }}
        >
          <div>
            <div style={settingLabel}>Rounds</div>
            <select
              style={selectStyle}
              value={settings.rounds}
              onChange={(e) =>
                updateSetting({ rounds: Number(e.target.value) })
              }
            >
              {ROUNDS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div style={settingLabel}>Timer</div>
            <select
              style={selectStyle}
              value={settings.timerSeconds}
              onChange={(e) =>
                updateSetting({ timerSeconds: Number(e.target.value) })
              }
            >
              {TIMER_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}s
                </option>
              ))}
            </select>
          </div>
          <div>
            <div style={settingLabel}>Penalty</div>
            <select
              style={selectStyle}
              value={settings.penaltyEnabled ? "on" : "off"}
              onChange={(e) =>
                updateSetting({ penaltyEnabled: e.target.value === "on" })
              }
            >
              <option value="on">ON (-200)</option>
              <option value="off">OFF</option>
            </select>
          </div>
          <div>
            <div style={settingLabel}>Score Floor</div>
            <select
              style={selectStyle}
              value={settings.scoreFloorEnabled ? "on" : "off"}
              onChange={(e) =>
                updateSetting({
                  scoreFloorEnabled: e.target.value === "on",
                })
              }
            >
              <option value="off">OFF (neg.)</option>
              <option value="on">ON (min 0)</option>
            </select>
          </div>
        </div>
      )}

      {/* Settings display for non-hosts */}
      {!isHost && (
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginBottom: 16,
            fontFamily: "var(--font-space-mono)",
            fontSize: 10,
            color: "var(--mt)",
            letterSpacing: 0.5,
          }}
        >
          <span>{settings.rounds} ROUNDS</span>
          <span>{settings.timerSeconds}S TIMER</span>
          <span>PENALTY {settings.penaltyEnabled ? "ON" : "OFF"}</span>
        </div>
      )}

      {/* Player list */}
      <div className="badge-wrap" style={{ marginBottom: 20 }}>
        <div
          style={{
            ...settingLabel,
            marginBottom: 12,
          }}
        >
          Newsroom Staff ({players.length}/{maxPlayers})
        </div>
        {players.map((p) => (
          <div
            key={p.uid}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px solid var(--bd)",
            }}
          >
            <Avatar
              emoji={p.avatar?.emoji || "🎯"}
              bgColor={p.avatar?.bgColor || "#2196F3"}
              size={32}
            />
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: 14,
                fontWeight: 700,
                flex: 1,
                textAlign: "left",
              }}
            >
              {p.playerName}
            </span>
            {p.isHost && (
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 9,
                  color: "var(--gold)",
                  letterSpacing: 1,
                }}
              >
                HOST
              </span>
            )}
            {isHost && !p.isHost && (
              <span
                style={{
                  cursor: "pointer",
                  fontSize: 12,
                  color: "var(--mt)",
                  padding: "2px 6px",
                }}
                onClick={() => kickPlayer(p.uid)}
                title="Remove player"
              >
                ✕
              </span>
            )}
          </div>
        ))}

        {players.length < 2 && (
          <div
            style={{
              padding: "12px 0",
              fontStyle: "italic",
              fontSize: 12,
              color: "var(--mt)",
            }}
          >
            Waiting for more staff...
          </div>
        )}

        {isHost && (
          <button
            className="btnp"
            onClick={startGame}
            disabled={starting || players.length < 2}
            style={{ marginTop: 20, width: "100%" }}
          >
            {starting ? "Starting..." : "Start Interview ⏎"}
          </button>
        )}

        {!isHost && (
          <p
            style={{
              marginTop: 16,
              fontSize: 11,
              color: "var(--mt)",
              fontStyle: "italic",
            }}
          >
            Waiting for host to start the interview...
          </p>
        )}

        {error && (
          <div
            style={{
              color: "var(--red)",
              fontSize: 11,
              marginTop: 12,
              fontFamily: "var(--font-space-mono)",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
