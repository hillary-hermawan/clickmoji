"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Masthead from "@/components/newspaper/Masthead";
import SectionsNav from "@/components/newspaper/SectionsNav";
import Ticker from "@/components/newspaper/Ticker";
import TopAd from "@/components/newspaper/TopAd";
import Columns from "@/components/newspaper/Columns";
import Lobby from "@/components/multiplayer/Lobby";
import WaitingRoom from "@/components/multiplayer/WaitingRoom";
import { FAKE_NAMES } from "@/lib/game-data";

export default function LobbyPage() {
  const router = useRouter();
  const [emojiMode, setEmojiMode] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    setPlayerName(FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)]);
  }, []);

  const handleToggleMode = useCallback((mode: "english" | "emoji") => {
    setEmojiMode(mode === "emoji");
  }, []);

  const handleRoomCreated = useCallback((id: string, code: string) => {
    setRoomId(id);
    setRoomCode(code);
  }, []);

  const handleRoomJoined = useCallback(
    (id: string) => {
      router.push(`/room/${id}`);
    },
    [router]
  );

  const handleGameStart = useCallback(
    (seed: number) => {
      if (roomId) {
        router.push(`/room/${roomId}`);
      }
    },
    [roomId, router]
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
            <div className="game-wrap" style={{ height: "auto" }}>
              {!roomId ? (
                <Lobby
                  onRoomCreated={handleRoomCreated}
                  onRoomJoined={handleRoomJoined}
                  playerName={playerName}
                  onNameChange={setPlayerName}
                />
              ) : (
                <WaitingRoom
                  roomId={roomId}
                  roomCode={roomCode}
                  onGameStart={handleGameStart}
                />
              )}
            </div>
          </main>
          <Columns emojiMode={emojiMode} />
        </div>
      </div>
    </>
  );
}
