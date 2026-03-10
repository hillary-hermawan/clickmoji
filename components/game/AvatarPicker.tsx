"use client";

import { AVATAR_EMOJIS, AVATAR_COLORS } from "@/lib/game-data";
import type { Avatar as AvatarType } from "@/types/game";
import Avatar from "./Avatar";

interface AvatarPickerProps {
  avatar: AvatarType;
  onAvatarChange: (avatar: AvatarType) => void;
}

export default function AvatarPicker({
  avatar,
  onAvatarChange,
}: AvatarPickerProps) {
  return (
    <div style={{ maxWidth: 280, margin: "0 auto" }}>
      {/* Current avatar preview */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Avatar emoji={avatar.emoji} bgColor={avatar.bgColor} size={56} />
      </div>

      {/* Emoji grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 6,
          marginBottom: 12,
        }}
      >
        {AVATAR_EMOJIS.map((em) => (
          <button
            key={em}
            type="button"
            onClick={() => onAvatarChange({ ...avatar, emoji: em })}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 40,
              fontSize: 22,
              background: "var(--game-bg)",
              border:
                avatar.emoji === em
                  ? "2px solid var(--tx)"
                  : "2px solid var(--bd)",
              borderRadius: 6,
              cursor: "pointer",
              opacity: avatar.emoji === em ? 1 : 0.7,
              transition: "opacity 0.15s, border-color 0.15s",
            }}
          >
            {em}
          </button>
        ))}
      </div>

      {/* Color swatches */}
      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {AVATAR_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onAvatarChange({ ...avatar, bgColor: color })}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: color,
              border:
                avatar.bgColor === color
                  ? "2px solid var(--tx)"
                  : "2px solid transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#fff",
              fontWeight: 700,
              padding: 0,
              lineHeight: 1,
            }}
          >
            {avatar.bgColor === color ? "✓" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
