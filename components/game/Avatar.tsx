"use client";

interface AvatarProps {
  emoji: string;
  bgColor: string;
  size?: number;
}

export default function Avatar({ emoji, bgColor, size = 40 }: AvatarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        flexShrink: 0,
        width: size,
        height: size,
        backgroundColor: bgColor,
        fontSize: size * 0.55,
        lineHeight: 1,
      }}
    >
      {emoji}
    </div>
  );
}
