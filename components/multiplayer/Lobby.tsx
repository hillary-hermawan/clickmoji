"use client";

import { useState } from "react";
import { ensureAnonymousAuth } from "@/lib/firebase";

interface LobbyProps {
  onRoomCreated: (roomId: string, code: string) => void;
  onRoomJoined: (roomId: string) => void;
  playerName: string;
  onNameChange: (name: string) => void;
}

export default function Lobby({
  onRoomCreated,
  onRoomJoined,
  playerName,
  onNameChange,
}: LobbyProps) {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createRoom = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await ensureAnonymousAuth();
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostSessionId: user.uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Join as host
      await fetch(`/api/rooms/${data.roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, playerName }),
      });

      onRoomCreated(data.roomId, data.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!joinCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      const user = await ensureAnonymousAuth();

      // Look up room by code
      const lookupRes = await fetch(
        `/api/rooms/_?code=${encodeURIComponent(joinCode.trim().toUpperCase())}`
      );
      const lookupData = await lookupRes.json();
      if (!lookupRes.ok) throw new Error(lookupData.error || "Room not found");

      const roomId = lookupData.id;

      // Join room
      const joinRes = await fetch(`/api/rooms/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, playerName }),
      });
      const joinData = await joinRes.json();
      if (!joinRes.ok) throw new Error(joinData.error);

      onRoomJoined(roomId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start" style={{ textAlign: "center" }}>
      <div className="start-title">Multiplayer Lobby</div>
      <p className="start-sub">
        Create a room and invite friends, or join an existing room with a code.
      </p>

      <div className="badge-wrap" style={{ marginBottom: 20 }}>
        <div className="badge-photo">🎮</div>
        <div className="badge-label">Your Name</div>
        <div className="badge-name-row">
          <input
            type="text"
            className="badge-input"
            value={playerName}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={24}
            spellCheck={false}
          />
        </div>
        <div className="badge-dept" style={{ marginBottom: 20 }}>
          Translation Desk — Multiplayer Division
        </div>

        <button
          className="btnp"
          onClick={createRoom}
          disabled={loading}
          style={{ marginBottom: 16 }}
        >
          {loading ? "Creating..." : "Create Room"}
        </button>

        <div
          style={{
            borderTop: "1px solid var(--bd)",
            margin: "16px 0",
            paddingTop: 16,
          }}
        >
          <div className="badge-label" style={{ marginBottom: 8 }}>
            Or Join With Code
          </div>
          <input
            type="text"
            className="badge-input"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="MOJI-1234"
            maxLength={9}
            style={{ marginBottom: 12, textTransform: "uppercase" }}
          />
          <br />
          <button className="btnp" onClick={joinRoom} disabled={loading}>
            {loading ? "Joining..." : "Join Room"}
          </button>
        </div>

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
