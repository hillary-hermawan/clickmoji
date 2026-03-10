"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import GameScreen from "@/components/game/GameScreen";
import GameOverScreen from "@/components/game/GameOverScreen";
import { mulberry32, pickQuestion, initialGameState } from "@/lib/game-logic";
import type { GameState, QuestionPick, Headline, Player } from "@/types/game";

interface MultiplayerGameProps {
  roomId: string;
  seed: number;
  playerName: string;
}

export default function MultiplayerGame({
  roomId,
  seed,
  playerName,
}: MultiplayerGameProps) {
  const [state, setState] = useState<GameState>(initialGameState);
  const [question, setQuestion] = useState<QuestionPick | null>(null);
  const [screen, setScreen] = useState<"game" | "gameover">("game");
  const [players, setPlayers] = useState<Player[]>([]);
  const [lastCorrectH, setLastCorrectH] = useState("");
  const [lastChosenH, setLastChosenH] = useState("");
  const [lastQuestion, setLastQuestion] = useState<Headline | null>(null);
  const [isWin, setIsWin] = useState(false);
  const rngRef = useRef(mulberry32(seed));
  const stateRef = useRef(state);
  stateRef.current = state;

  // Init first question
  useEffect(() => {
    const rng = mulberry32(seed);
    rngRef.current = rng;
    const s = initialGameState();
    const q = pickQuestion(s.used, s.q + 1, rng);
    s.used.push(q.cor.h);
    s.cur = q.cor;
    setState(s);
    setQuestion(q);
  }, [seed]);

  // Subscribe to other players
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "rooms", roomId, "players"),
      (snap) => {
        setPlayers(snap.docs.map((d) => d.data() as Player));
      }
    );
    return () => unsub();
  }, [roomId]);

  // Update own player doc
  const updatePlayerDoc = useCallback(
    async (round: number, alive: boolean) => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const playerRef = doc(db, "rooms", roomId, "players", uid);
      await updateDoc(playerRef, {
        currentRound: round,
        isAlive: alive,
        ...(alive ? {} : { eliminatedAt: serverTimestamp() }),
      });
    },
    [roomId]
  );

  const handleAnswer = useCallback(
    (chosen: string, correct: string) => {
      const s = { ...stateRef.current };
      const isCorrect = chosen === correct;

      if (isCorrect) {
        s.streak++;
        s.best = Math.max(s.best, s.streak);
        s.q++;

        if (s.q >= 50) {
          setState(s);
          setIsWin(true);
          setScreen("gameover");
          updatePlayerDoc(50, true);
          return;
        }

        setState(s);
        const q = pickQuestion(s.used, s.q + 1, rngRef.current);
        s.used.push(q.cor.h);
        s.cur = q.cor;
        setState({ ...s });
        setQuestion(q);
        updatePlayerDoc(s.q, true);
      } else {
        s.streak = 0;
        s.q++;
        setState(s);
        setLastCorrectH(correct);
        setLastChosenH(chosen);
        setLastQuestion(stateRef.current.cur);
        setIsWin(false);
        setScreen("gameover");
        updatePlayerDoc(s.q, false);
      }
    },
    [updatePlayerDoc]
  );

  const handleTimeUp = useCallback(() => {
    const s = { ...stateRef.current };
    s.streak = 0;
    s.q++;
    setState(s);
    setLastCorrectH(s.cur?.h || "");
    setLastChosenH("\u23F1\uFE0F DEADLINE MISSED");
    setLastQuestion(s.cur);
    setIsWin(false);
    setScreen("gameover");
    updatePlayerDoc(s.q, false);
  }, [updatePlayerDoc]);

  const handleRestart = useCallback(() => {
    // In multiplayer, restart just goes back to viewing scoreboard
    // Could navigate back to lobby
  }, []);

  // Update cur in state
  useEffect(() => {
    if (question) {
      setState((prev) => ({ ...prev, cur: question.cor }));
    }
  }, [question]);

  const alivePlayers = players.filter((p) => p.isAlive);
  const deadPlayers = players.filter((p) => !p.isAlive);

  return (
    <div className="game-wrap" style={{ height: "auto" }}>
      {screen === "game" && question && (
        <div>
          <GameScreen
            question={question}
            roundNum={state.q + 1}
            playerName={playerName}
            onAnswer={handleAnswer}
            onTimeUp={handleTimeUp}
            onRestart={handleRestart}
          />
        </div>
      )}

      {screen === "gameover" && (
        <div>
          <GameOverScreen
            roundsCompleted={state.q}
            playerName={playerName}
            lastQuestion={lastQuestion}
            lastCorrectH={lastCorrectH}
            lastChosenH={lastChosenH}
            isWin={isWin}
            onRestart={handleRestart}
          />
        </div>
      )}

      {/* Live Scoreboard */}
      <div
        style={{
          border: "1px solid var(--bd)",
          background: "var(--game-bg)",
          padding: 16,
          marginTop: 12,
        }}
      >
        <div className="col-label">Live Scoreboard</div>
        {alivePlayers
          .sort((a, b) => b.currentRound - a.currentRound)
          .map((p) => (
            <div
              key={p.uid}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 0",
                borderBottom: "1px solid var(--bd)",
                fontSize: 12,
              }}
            >
              <span style={{ fontWeight: 700 }}>
                {p.playerName} {p.isHost && "👑"}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: "var(--green)",
                }}
              >
                Round {p.currentRound}
              </span>
            </div>
          ))}
        {deadPlayers.map((p) => (
          <div
            key={p.uid}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
              borderBottom: "1px solid var(--bd)",
              fontSize: 12,
              opacity: 0.5,
            }}
          >
            <span style={{ textDecoration: "line-through" }}>
              {p.playerName}
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                color: "var(--red)",
              }}
            >
              Eliminated (R{p.currentRound})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
