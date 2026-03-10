"use client";

import { useState, useCallback } from "react";
import Masthead from "@/components/newspaper/Masthead";
import SectionsNav from "@/components/newspaper/SectionsNav";
import Ticker from "@/components/newspaper/Ticker";
import TopAd from "@/components/newspaper/TopAd";
import Columns from "@/components/newspaper/Columns";
import Lobby from "@/components/multiplayer/Lobby";

export default function LobbyPage() {
  const [emojiMode, setEmojiMode] = useState(false);

  const handleToggleMode = useCallback((mode: "english" | "emoji") => {
    setEmojiMode(mode === "emoji");
  }, []);

  return (
    <>
      <TopAd emojiMode={emojiMode} refreshKey={0} />
      <Masthead emojiMode={emojiMode} onToggleMode={handleToggleMode} />
      <SectionsNav emojiMode={emojiMode} />
      <Ticker emojiMode={emojiMode} />
      <div className="page">
        <div className="two-col">
          <main className="col-center">
            <div className="game-wrap" style={{ height: "auto" }}>
              <Lobby />
            </div>
          </main>
          <Columns emojiMode={emojiMode} />
        </div>
      </div>
    </>
  );
}
