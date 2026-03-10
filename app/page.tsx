"use client";

import { useState, useCallback } from "react";
import Masthead from "@/components/newspaper/Masthead";
import SectionsNav from "@/components/newspaper/SectionsNav";
import Ticker from "@/components/newspaper/Ticker";
import TopAd from "@/components/newspaper/TopAd";
import Columns from "@/components/newspaper/Columns";
import SoloGame from "@/components/game/SoloGame";

export default function Home() {
  const [emojiMode, setEmojiMode] = useState(false);
  const [adRefreshKey, setAdRefreshKey] = useState(0);

  const handleToggleMode = useCallback((mode: "english" | "emoji") => {
    setEmojiMode(mode === "emoji");
  }, []);

  const handleAdRefresh = useCallback(() => {
    setAdRefreshKey((k) => k + 1);
  }, []);

  return (
    <>
      <TopAd emojiMode={emojiMode} refreshKey={adRefreshKey} />
      <Masthead emojiMode={emojiMode} onToggleMode={handleToggleMode} />
      <SectionsNav emojiMode={emojiMode} />
      <Ticker emojiMode={emojiMode} />
      <div className="page">
        <div className="two-col">
          <main className="col-center">
            <SoloGame onAdRefresh={handleAdRefresh} />
          </main>
          <Columns emojiMode={emojiMode} />
        </div>
      </div>
    </>
  );
}
