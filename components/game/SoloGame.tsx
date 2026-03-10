"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";
import GameOverScreen from "./GameOverScreen";
import { pickQuestion, initialGameState } from "@/lib/game-logic";
import { launchConfetti } from "@/lib/emoji-react";
import type { GameScreen as GameScreenType, GameState, QuestionPick, Headline } from "@/types/game";

interface SoloGameProps {
  onAdRefresh: () => void;
}

export default function SoloGame({ onAdRefresh }: SoloGameProps) {
  const [screen, setScreen] = useState<GameScreenType>("start");
  const [state, setState] = useState<GameState>(initialGameState);
  const [playerName, setPlayerName] = useState("Employee #2,026");
  const [question, setQuestion] = useState<QuestionPick | null>(null);
  const [lastCorrectH, setLastCorrectH] = useState("");
  const [lastChosenH, setLastChosenH] = useState("");
  const [lastQuestion, setLastQuestion] = useState<Headline | null>(null);
  const [isWin, setIsWin] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const generateQuestion = useCallback((s: GameState) => {
    const q = pickQuestion(s.used, s.q + 1);
    s.used.push(q.cor.h);
    return q;
  }, []);

  const handleStart = useCallback(
    (name: string) => {
      setPlayerName(name);
      const s = initialGameState();
      setState(s);
      const q = generateQuestion(s);
      setQuestion(q);
      setScreen("game");
      onAdRefresh();
    },
    [generateQuestion, onAdRefresh]
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
          // Win!
          setState(s);
          setIsWin(true);
          setScreen("gameover");
          launchConfetti();
          return;
        }

        setState(s);
        const q = pickQuestion(s.used, s.q + 1);
        s.used.push(q.cor.h);
        setState({ ...s });
        setQuestion(q);
        onAdRefresh();
      } else {
        s.streak = 0;
        s.q++;
        setState(s);
        setLastCorrectH(correct);
        setLastChosenH(chosen);
        setLastQuestion(stateRef.current.cur);
        setIsWin(false);
        setScreen("gameover");
      }
    },
    [onAdRefresh]
  );

  const handleTimeUp = useCallback(() => {
    const s = { ...stateRef.current };
    s.streak = 0;
    s.q++;
    setState(s);
    setLastCorrectH(s.cur?.h || "");
    setLastChosenH("⏱️ DEADLINE MISSED");
    setLastQuestion(s.cur);
    setIsWin(false);
    setScreen("gameover");
  }, []);

  const handleRestart = useCallback(() => {
    const s = { ...initialGameState(), best: stateRef.current.best };
    setState(s);
    const q = generateQuestion(s);
    setQuestion(q);
    setScreen("game");
    onAdRefresh();
  }, [generateQuestion, onAdRefresh]);

  // Update cur in state when question changes
  useEffect(() => {
    if (question) {
      setState((prev) => ({ ...prev, cur: question.cor }));
    }
  }, [question]);

  // Enter key handler for start/gameover
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (screen === "start") {
        const inInput = document.activeElement?.tagName === "INPUT";
        if (inInput) (document.activeElement as HTMLElement).blur();
        // Don't auto-start, let StartScreen handle it
        return;
      }
      if (screen === "gameover") {
        handleRestart();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, handleRestart]);

  return (
    <div className="game-wrap">
      {screen === "start" && <StartScreen onStart={handleStart} />}
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
    </div>
  );
}
