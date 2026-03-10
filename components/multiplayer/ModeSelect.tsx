"use client";

interface ModeSelectProps {
  onSelectSolo: () => void;
  onSelectMultiplayer: () => void;
}

export default function ModeSelect({
  onSelectSolo,
  onSelectMultiplayer,
}: ModeSelectProps) {
  return (
    <div className="start">
      <div className="start-title">
        Welcome to
        <br />
        Clickmoji&apos;s Translation Desk
      </div>
      <p className="start-sub">
        CLICKMOJI is going emoji-first. Match emoji sequences to headlines
        &mdash; solo or with friends.
      </p>
      <div className="badge-wrap">
        <button
          className="btnp"
          onClick={onSelectSolo}
          style={{ marginBottom: 12, width: "100%" }}
        >
          Solo Training &#x23CE;
        </button>
        <button
          className="btnp"
          onClick={onSelectMultiplayer}
          style={{
            width: "100%",
            background: "var(--accent)",
          }}
        >
          Group Interview (Multiplayer)
        </button>
        <div
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: 10,
            color: "var(--mt)",
            marginTop: 10,
            letterSpacing: 0.5,
          }}
        >
          2&ndash;4 PLAYERS &middot; 10 ROUNDS &middot; REAL-TIME
        </div>
      </div>
    </div>
  );
}
