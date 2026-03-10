"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";
import type { Player } from "@/types/game";

interface WaitingRoomProps {
  roomId: string;
  roomCode: string;
  onGameStart: (seed: number) => void;
}

export default function WaitingRoom({
  roomId,
  roomCode,
  onGameStart,
}: WaitingRoomProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

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

  // Subscribe to room status changes
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      const data = snap.data();
      if (data?.status === "playing") {
        onGameStart(data.seed);
      }
    });
    return () => unsub();
  }, [roomId, onGameStart]);

  const startGame = async () => {
    setStarting(true);
    setError("");
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
    }
  };

  return (
    <div className="start" style={{ textAlign: "center" }}>
      <div className="start-title">Waiting Room</div>
      <p className="start-sub">
        Share this code with friends:
      </p>

      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 4,
          margin: "12px 0 20px",
          color: "var(--tx)",
        }}
      >
        {roomCode}
      </div>

      <div className="badge-wrap" style={{ marginBottom: 20 }}>
        <div className="badge-label" style={{ marginBottom: 12 }}>
          Players ({players.length})
        </div>
        {players.map((p) => (
          <div
            key={p.uid}
            style={{
              padding: "6px 0",
              fontFamily: "'Playfair Display', serif",
              fontSize: 14,
              fontWeight: 700,
              borderBottom: "1px solid var(--bd)",
            }}
          >
            {p.playerName} {p.isHost && "👑"}
          </div>
        ))}

        {isHost && (
          <button
            className="btnp"
            onClick={startGame}
            disabled={starting || players.length < 1}
            style={{ marginTop: 20 }}
          >
            {starting ? "Starting..." : "Start Game ⏎"}
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
            Waiting for host to start the game...
          </p>
        )}

        {error && (
          <div
            style={{
              color: "var(--red)",
              fontSize: 11,
              marginTop: 12,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
