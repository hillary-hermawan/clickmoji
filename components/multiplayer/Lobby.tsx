"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ensureAnonymousAuth } from "@/lib/firebase";
import { FAKE_NAMES, AVATAR_EMOJIS, AVATAR_COLORS } from "@/lib/game-data";
import Avatar from "@/components/game/Avatar";
import AvatarPicker from "@/components/game/AvatarPicker";
import type { Avatar as AvatarType } from "@/types/game";

function randomAvatar(): AvatarType {
  return {
    emoji: AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
    bgColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  };
}

export default function Lobby() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarType>({ emoji: "🎯", bgColor: "#2196F3" });
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)]);
    setAvatar(randomAvatar());
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

  const getPlayerName = () =>
    name.trim() || FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];

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

      const playerName = getPlayerName();
      await fetch(`/api/rooms/${data.roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          playerName,
          avatar,
        }),
      });

      sessionStorage.setItem("mp_playerName", playerName);
      sessionStorage.setItem("mp_avatar", JSON.stringify(avatar));
      router.push(`/room/${data.roomId}`);
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

      const lookupRes = await fetch(
        `/api/rooms/_?code=${encodeURIComponent(joinCode.trim().toUpperCase())}`
      );
      const lookupData = await lookupRes.json();
      if (!lookupRes.ok)
        throw new Error(lookupData.error || "Room not found");

      const roomId = lookupData.id;

      const playerName = getPlayerName();
      const joinRes = await fetch(`/api/rooms/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          playerName,
          avatar,
        }),
      });
      const joinData = await joinRes.json();
      if (!joinRes.ok) throw new Error(joinData.error);

      sessionStorage.setItem("mp_playerName", playerName);
      sessionStorage.setItem("mp_avatar", JSON.stringify(avatar));
      router.push(`/room/${roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start" style={{ textAlign: "center" }}>
      <div className="start-title">Group Interview</div>
      <p className="start-sub">
        Compete in real-time against other translators. Fastest correct answer
        wins the most points.
      </p>

      <div className="badge-wrap">
        {/* Avatar */}
        <div
          style={{ cursor: "pointer", marginBottom: 4 }}
          onClick={() => setShowAvatarPicker(!showAvatarPicker)}
          title="Customize avatar"
        >
          <Avatar emoji={avatar.emoji} bgColor={avatar.bgColor} size={56} />
        </div>

        {showAvatarPicker && (
          <div style={{ marginBottom: 12 }}>
            <AvatarPicker avatar={avatar} onAvatarChange={setAvatar} />
          </div>
        )}

        {/* Name input */}
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
        <div className="badge-dept">Translation Desk — Multiplayer Division</div>

        {/* Join with code */}
        <div style={{ marginTop: 16 }}>
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
            Enter Room Code
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <input
              type="text"
              className="badge-input"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="VIBES"
              maxLength={6}
              style={{
                width: 120,
                textTransform: "uppercase",
                textAlign: "center",
                letterSpacing: 3,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") joinRoom();
              }}
            />
            <button
              className="btnp"
              onClick={joinRoom}
              disabled={loading || !joinCode.trim()}
              style={{ padding: "10px 20px" }}
            >
              {loading ? "..." : "Join"}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid var(--bd)",
            margin: "16px 0",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -8,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--game-bg)",
              padding: "0 12px",
              fontFamily: "var(--font-space-mono)",
              fontSize: 10,
              color: "var(--mt)",
              letterSpacing: 1,
            }}
          >
            OR
          </span>
        </div>

        {/* Create room */}
        <button
          className="btnp"
          onClick={createRoom}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Creating..." : "Create New Room"}
        </button>

        {/* Back link */}
        <div style={{ marginTop: 12 }}>
          <span
            className="card-restart"
            style={{ marginLeft: 0 }}
            onClick={() => router.push("/")}
          >
            &larr; Back to Solo Training
          </span>
        </div>

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
