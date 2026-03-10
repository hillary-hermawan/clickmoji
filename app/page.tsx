"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Masthead from "@/components/newspaper/Masthead";
import SectionsNav from "@/components/newspaper/SectionsNav";
import Ticker from "@/components/newspaper/Ticker";
import TopAd from "@/components/newspaper/TopAd";
import Columns from "@/components/newspaper/Columns";
import SoloGame from "@/components/game/SoloGame";
import ModeSelect from "@/components/multiplayer/ModeSelect";

export default function Home() {
  const router = useRouter();
  const [emojiMode, setEmojiMode] = useState(false);
  const [adRefreshKey, setAdRefreshKey] = useState(0);
  const [mode, setMode] = useState<"select" | "solo">("select");

  const handleToggleMode = useCallback((m: "english" | "emoji") => {
    setEmojiMode(m === "emoji");
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
            {mode === "select" && (
              <div className="game-wrap">
                <ModeSelect
                  onSelectSolo={() => setMode("solo")}
                  onSelectMultiplayer={() => router.push("/lobby")}
                />
              </div>
            )}
            {mode === "solo" && (
              <SoloGame onAdRefresh={handleAdRefresh} />
            )}
          </main>
          <Columns emojiMode={emojiMode} />
        </div>
      </div>
    </>
  );
}
