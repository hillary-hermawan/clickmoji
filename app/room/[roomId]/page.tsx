"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Masthead from "@/components/newspaper/Masthead";
import SectionsNav from "@/components/newspaper/SectionsNav";
import Ticker from "@/components/newspaper/Ticker";
import TopAd from "@/components/newspaper/TopAd";
import Columns from "@/components/newspaper/Columns";
import WaitingRoom from "@/components/multiplayer/WaitingRoom";
import MultiplayerGame from "@/components/multiplayer/MultiplayerGame";
import { db, ensureAnonymousAuth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { GameSettings } from "@/types/game";
import { DEFAULT_GAME_SETTINGS } from "@/types/game";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [emojiMode, setEmojiMode] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [seed, setSeed] = useState<number | null>(null);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [status, setStatus] = useState<"loading" | "waiting" | "playing">(
    "loading"
  );
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    // Restore player name from session
    const storedName = sessionStorage.getItem("mp_playerName");
    if (storedName) setPlayerName(storedName);

    async function load() {
      try {
        await ensureAnonymousAuth();
        const roomSnap = await getDoc(doc(db, "rooms", roomId));
        if (roomSnap.exists()) {
          const data = roomSnap.data();
          setRoomCode(data.code);
          if (data.settings) setSettings(data.settings);
          if (data.status === "playing") {
            setSeed(data.seed);
            setStatus("playing");
          } else {
            setStatus("waiting");
          }
        }
      } catch (err) {
        console.error("Room load error:", err);
      }
    }
    load();
  }, [roomId]);

  const handleToggleMode = useCallback((mode: "english" | "emoji") => {
    setEmojiMode(mode === "emoji");
  }, []);

  const handleGameStart = useCallback(
    (gameSeed: number, gameSettings: GameSettings) => {
      setSeed(gameSeed);
      setSettings(gameSettings);
      setStatus("playing");
    },
    []
  );

  return (
    <>
      <TopAd emojiMode={emojiMode} refreshKey={0} />
      <Masthead emojiMode={emojiMode} onToggleMode={handleToggleMode} />
      <SectionsNav emojiMode={emojiMode} />
      <Ticker emojiMode={emojiMode} />
      <div className="page">
        <div className="two-col">
          <main className="col-center">
            {status === "loading" && (
              <div className="start" style={{ textAlign: "center" }}>
                <div className="start-title">Loading room...</div>
              </div>
            )}
            {status === "waiting" && (
              <div className="game-wrap" style={{ height: "auto" }}>
                <WaitingRoom
                  roomId={roomId}
                  roomCode={roomCode}
                  onGameStart={handleGameStart}
                />
              </div>
            )}
            {status === "playing" && seed !== null && (
              <MultiplayerGame
                roomId={roomId}
                seed={seed}
                settings={settings}
                playerName={playerName || "Player"}
              />
            )}
          </main>
          <Columns emojiMode={emojiMode} />
        </div>
      </div>
    </>
  );
}
