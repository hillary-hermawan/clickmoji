"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import GameScreen from "@/components/game/GameScreen";
import RoundResults from "@/components/multiplayer/RoundResults";
import FinalStandings from "@/components/multiplayer/FinalStandings";
import { mulberry32, pickQuestion, calculateRoundScore } from "@/lib/game-logic";
import type { QuestionPick, Player, GameSettings, Room, RoundHistoryEntry } from "@/types/game";

interface MultiplayerGameProps {
  roomId: string;
  seed: number;
  settings: GameSettings;
  playerName: string;
}

export default function MultiplayerGame({
  roomId,
  seed,
  settings,
  playerName,
}: MultiplayerGameProps) {
  const router = useRouter();

  // Room state from Firestore
  const [room, setRoom] = useState<Partial<Room>>({
    currentRound: 1,
    roundPhase: "question",
    status: "playing",
  });

  // Player list from Firestore
  const [players, setPlayers] = useState<Player[]>([]);

  // Local state
  const [question, setQuestion] = useState<QuestionPick | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [myStreak, setMyStreak] = useState(0);
  const [myBestStreak, setMyBestStreak] = useState(0);
  const [hasAnsweredThisRound, setHasAnsweredThisRound] = useState(false);
  const [resultsCountdown, setResultsCountdown] = useState(5);
  const [correctHeadline, setCorrectHeadline] = useState("");

  // Refs for stable access in callbacks
  const rngRef = useRef(mulberry32(seed));
  const usedRef = useRef<string[]>([]);
  const roundStartTimeRef = useRef<number>(Date.now());
  const myScoreRef = useRef(0);
  const myStreakRef = useRef(0);
  const myBestStreakRef = useRef(0);
  const isHostRef = useRef(false);

  // Keep refs in sync
  myScoreRef.current = myScore;
  myStreakRef.current = myStreak;
  myBestStreakRef.current = myBestStreak;

  const currentRound = room.currentRound ?? 1;
  const roundPhase = room.roundPhase ?? "question";
  const roomStatus = room.status ?? "playing";
  const isHotTake = settings.hotTakeRounds.includes(currentRound);

  const uid = auth?.currentUser?.uid;

  // Determine if current user is host
  useEffect(() => {
    const me = players.find((p) => p.uid === uid);
    if (me) isHostRef.current = me.isHost;
  }, [players, uid]);

  // Generate question for a specific round (deterministic from seed)
  const generateQuestionForRound = useCallback(
    (round: number) => {
      const rng = mulberry32(seed);
      const used: string[] = [];
      let q: QuestionPick | null = null;

      for (let i = 1; i <= round; i++) {
        q = pickQuestion(used, i, rng);
        used.push(q.cor.h);
      }

      usedRef.current = used;
      rngRef.current = rng;
      return q!;
    },
    [seed]
  );

  // Subscribe to room doc
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRoom({
          currentRound: data.currentRound ?? 1,
          roundPhase: data.roundPhase ?? "question",
          status: data.status ?? "playing",
          roundStartedAt: data.roundStartedAt?.toDate?.() ?? null,
        });
      }
    });
    return () => unsub();
  }, [roomId]);

  // Subscribe to players subcollection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "rooms", roomId, "players"),
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            ...data,
            uid: d.id,
          } as Player;
        });
        setPlayers(list);
      }
    );
    return () => unsub();
  }, [roomId]);

  // When round changes, generate question
  useEffect(() => {
    if (roomStatus !== "playing") return;
    if (roundPhase !== "question") return;

    const q = generateQuestionForRound(currentRound);
    setQuestion(q);
    setCorrectHeadline(q.cor.h);
    setHasAnsweredThisRound(false);
    roundStartTimeRef.current = Date.now();
  }, [currentRound, roundPhase, roomStatus, generateQuestionForRound]);

  // Host: auto-advance to results when all players answered
  useEffect(() => {
    if (!isHostRef.current) return;
    if (roundPhase !== "question") return;
    if (players.length === 0) return;

    const allAnswered = players.every(
      (p) => p.currentRoundAnswer !== null
    );

    if (allAnswered) {
      // Brief delay so last answer visually registers
      const timer = setTimeout(async () => {
        try {
          await fetch(`/api/rooms/${roomId}/advance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: auth?.currentUser?.uid,
              phase: "results",
            }),
          });
        } catch {
          // ignore
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [players, roundPhase, roomId]);

  // Results countdown: host advances to next round after countdown
  useEffect(() => {
    if (roundPhase !== "results") return;

    setResultsCountdown(5);
    const interval = setInterval(() => {
      setResultsCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Host advances to next round
          if (isHostRef.current) {
            fetch(`/api/rooms/${roomId}/advance`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                uid: auth?.currentUser?.uid,
                phase: "next",
              }),
            }).catch(() => {});
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [roundPhase, roomId]);

  // Handle player answer
  const handleAnswer = useCallback(
    async (chosen: string, correct: string) => {
      if (hasAnsweredThisRound || !uid) return;
      setHasAnsweredThisRound(true);

      const timeMs = Date.now() - roundStartTimeRef.current;
      const isCorrect = chosen === correct;

      const newStreak = isCorrect ? myStreakRef.current + 1 : 0;
      const pointsEarned = calculateRoundScore({
        correct: isCorrect,
        timeMs,
        timerSeconds: settings.timerSeconds,
        streak: isCorrect ? newStreak : 0,
        isHotTake,
        penaltyEnabled: settings.penaltyEnabled,
        penaltyPoints: settings.penaltyPoints,
        scoreFloorEnabled: settings.scoreFloorEnabled,
        scoreFloor: settings.scoreFloor,
        currentScore: myScoreRef.current,
      });

      const newScore = myScoreRef.current + pointsEarned;
      const newBestStreak = Math.max(myBestStreakRef.current, newStreak);

      setMyScore(newScore);
      setMyStreak(newStreak);
      setMyBestStreak(newBestStreak);

      const roundEntry: RoundHistoryEntry = {
        round: currentRound,
        chosen,
        correct: isCorrect,
        timeMs,
        pointsEarned,
      };

      // Write to Firestore
      const playerRef = doc(db, "rooms", roomId, "players", uid);
      try {
        await updateDoc(playerRef, {
          score: newScore,
          streak: newStreak,
          bestStreak: newBestStreak,
          currentRoundAnswer: {
            chosen,
            correct: isCorrect,
            answeredAt: Timestamp.now(),
            timeMs,
            pointsEarned,
          },
          roundHistory: arrayUnion(roundEntry),
        });
      } catch {
        // ignore write errors
      }
    },
    [
      hasAnsweredThisRound,
      uid,
      currentRound,
      roomId,
      settings,
      isHotTake,
    ]
  );

  // Handle time up
  const handleTimeUp = useCallback(async () => {
    if (hasAnsweredThisRound || !uid) return;
    setHasAnsweredThisRound(true);

    const timeMs = settings.timerSeconds * 1000;

    const pointsEarned = calculateRoundScore({
      correct: false,
      timeMs,
      timerSeconds: settings.timerSeconds,
      streak: 0,
      isHotTake,
      penaltyEnabled: settings.penaltyEnabled,
      penaltyPoints: settings.penaltyPoints,
      scoreFloorEnabled: settings.scoreFloorEnabled,
      scoreFloor: settings.scoreFloor,
      currentScore: myScoreRef.current,
    });

    const newScore = myScoreRef.current + pointsEarned;
    setMyScore(newScore);
    setMyStreak(0);

    const roundEntry: RoundHistoryEntry = {
      round: currentRound,
      chosen: null,
      correct: false,
      timeMs,
      pointsEarned,
    };

    const playerRef = doc(db, "rooms", roomId, "players", uid);
    try {
      await updateDoc(playerRef, {
        score: newScore,
        streak: 0,
        currentRoundAnswer: {
          chosen: null,
          correct: false,
          answeredAt: Timestamp.now(),
          timeMs,
          pointsEarned,
        },
        roundHistory: arrayUnion(roundEntry),
      });
    } catch {
      // ignore
    }
  }, [hasAnsweredThisRound, uid, currentRound, roomId, settings, isHotTake]);

  // Handle reaction emoji
  const handleReaction = useCallback(
    (emoji: string) => {
      // Could store in Firestore, for now just visual feedback
      const el = document.createElement("span");
      el.className = "emoji-react";
      el.textContent = emoji;
      el.style.left = `${50 + Math.random() * 30 - 15}%`;
      el.style.top = "50%";
      el.style.setProperty("--drift", `${Math.random() * 40 - 20}px`);
      el.style.fontSize = "32px";
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    },
    []
  );

  // Build opponents list for GameScreen pressure indicators
  const opponents = players
    .filter((p) => p.uid !== uid)
    .map((p) => ({
      playerName: p.playerName,
      avatar: p.avatar || { emoji: "🎯", bgColor: "#2196F3" },
      hasAnswered: p.currentRoundAnswer !== null,
    }));

  // Noop restart for multiplayer
  const handleRestart = useCallback(() => {}, []);

  // Callback after answering (for GameScreen's onAnswered)
  const handleAnswered = useCallback(() => {
    // No additional action needed; the answer callback handles Firestore
  }, []);

  const handlePlayAgain = useCallback(() => {
    // Navigate back to room (which will show waiting room)
    window.location.reload();
  }, []);

  const handleBackToLobby = useCallback(() => {
    router.push("/lobby");
  }, [router]);

  // Finished state
  if (roomStatus === "finished") {
    return (
      <div className="game-wrap" style={{ height: "auto" }}>
        <FinalStandings
          players={players}
          onPlayAgain={handlePlayAgain}
          onBackToLobby={handleBackToLobby}
        />
      </div>
    );
  }

  // Results phase
  if (roundPhase === "results" && roomStatus === "playing") {
    return (
      <div className="game-wrap" style={{ height: "auto" }}>
        <RoundResults
          roundNum={currentRound}
          totalRounds={settings.rounds}
          correctHeadline={correctHeadline}
          players={players}
          isHotTake={isHotTake}
          onReaction={handleReaction}
          countdown={resultsCountdown}
        />
      </div>
    );
  }

  // Question phase
  if (roundPhase === "question" && question && roomStatus === "playing") {
    return (
      <div className="game-wrap" style={{ height: "auto" }}>
        <GameScreen
          question={question}
          roundNum={currentRound}
          playerName={playerName}
          onAnswer={handleAnswer}
          onTimeUp={handleTimeUp}
          onRestart={handleRestart}
          mode="multiplayer"
          totalRounds={settings.rounds}
          score={myScore}
          timerOverride={settings.timerSeconds}
          isHotTake={isHotTake}
          opponents={opponents}
          onAnswered={handleAnswered}
          hideRestart
        />
      </div>
    );
  }

  // Loading / transition
  return (
    <div className="game-wrap" style={{ height: "auto" }}>
      <div className="start" style={{ textAlign: "center" }}>
        <div className="start-title">Loading round...</div>
      </div>
    </div>
  );
}
