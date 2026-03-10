"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getTL, getRL } from "@/lib/game-logic";
import type { Headline, QuestionPick } from "@/types/game";
import Avatar from "./Avatar";

interface GameScreenProps {
  question: QuestionPick;
  roundNum: number;
  playerName: string;
  onAnswer: (chosen: string, correct: string) => void;
  onTimeUp: () => void;
  onRestart: () => void;
  mode?: "solo" | "multiplayer";
  totalRounds?: number;
  score?: number;
  timerOverride?: number;
  isHotTake?: boolean;
  opponents?: Array<{
    playerName: string;
    avatar: { emoji: string; bgColor: string };
    hasAnswered: boolean;
  }>;
  onAnswered?: () => void;
  hideRestart?: boolean;
}

export default function GameScreen({
  question,
  roundNum,
  playerName,
  onAnswer,
  onTimeUp,
  onRestart,
  mode = "solo",
  totalRounds,
  score,
  timerOverride,
  isHotTake,
  opponents,
  onAnswered,
  hideRestart,
}: GameScreenProps) {
  const [answered, setAnswered] = useState(false);
  const [chosenH, setChosenH] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canSkipAtRef = useRef(Infinity);
  const answeredRef = useRef(false);

  const isMultiplayer = mode === "multiplayer";
  const effectiveTimerLength =
    timerOverride !== undefined ? timerOverride : getTL(roundNum);
  const tl = isMultiplayer
    ? effectiveTimerLength
    : getTL(roundNum);
  const title = getRL(roundNum);
  const correctH = question.cor.h;

  // Reset state on new question
  useEffect(() => {
    setAnswered(false);
    setChosenH(null);
    setShowFlash(false);
    answeredRef.current = false;
    canSkipAtRef.current = Infinity;

    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    // Start timer
    if (tl > 0) {
      setTimeLeft(tl);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 0.1;
          if (next <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            if (!answeredRef.current) {
              answeredRef.current = true;
              setAnswered(true);
              setTimeout(() => onTimeUp(), 700);
            }
            return 0;
          }
          return next;
        });
      }, 100);
    } else {
      setTimeLeft(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [question, tl, onTimeUp]);

  const handleAnswer = useCallback(
    (chosenHeadline: string) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      setAnswered(true);
      setChosenH(chosenHeadline);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      onAnswered?.();

      const isCorrect = chosenHeadline === correctH;
      if (isCorrect) {
        setShowFlash(true);
        canSkipAtRef.current = Date.now() + 350;
        autoTimerRef.current = setTimeout(() => {
          autoTimerRef.current = null;
          onAnswer(chosenHeadline, correctH);
        }, 1200);
      } else {
        setTimeout(() => onAnswer(chosenHeadline, correctH), 800);
      }
    },
    [correctH, onAnswer, onAnswered]
  );

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const inInput =
        document.activeElement?.tagName === "INPUT";
      if (inInput) return;

      // Skip auto-advance
      if (
        autoTimerRef.current &&
        Date.now() >= canSkipAtRef.current
      ) {
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
        onAnswer(correctH, correctH);
        return;
      }

      const idx = ["1", "2", "3", "4"].indexOf(e.key);
      if (idx >= 0 && !answeredRef.current && question.opts[idx]) {
        handleAnswer(question.opts[idx].h);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [question, handleAnswer, onAnswer, correctH]);

  const timerPct = tl > 0 ? (timeLeft / tl) * 100 : 100;
  const timerClass =
    timerPct < 25 ? "danger" : timerPct < 50 ? "warn" : "";

  const getButtonClass = (opt: Headline) => {
    if (!answered) return "ob";
    if (opt.h === correctH) return "ob correct";
    if (opt.h === chosenH && chosenH !== correctH) return "ob wrong";
    return "ob";
  };

  const getButtonStyle = (opt: Headline): React.CSSProperties => {
    if (answered && opt.h !== correctH && opt.h !== chosenH) {
      return { opacity: 0.35 };
    }
    return {};
  };

  // Compute opponent stats
  const answeredCount = opponents
    ? opponents.filter((o) => o.hasAnswered).length
    : 0;
  const totalOpponents = opponents ? opponents.length : 0;

  return (
    <div className="card" key={`q-${roundNum}`}>
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-score-item">
            {isMultiplayer ? (
              <>
                <div className="card-score-val">
                  {roundNum} of {totalRounds}
                </div>
                <div className="card-score-lbl">Round</div>
              </>
            ) : (
              <>
                <div className="card-score-val">
                  {Math.min(roundNum, 50)}/50
                </div>
                <div className="card-score-lbl">Level</div>
              </>
            )}
          </div>
          {!hideRestart && (
            <span
              className="card-restart"
              onClick={(e) => {
                e.stopPropagation();
                onRestart();
              }}
            >
              &#8635; Start over
            </span>
          )}
        </div>
        <div className="player-info">
          <div className="player-name">{playerName}</div>
          {isMultiplayer ? (
            <div className="player-title">
              {(score ?? 0).toLocaleString()} pts
            </div>
          ) : (
            <div className="player-title">{title}</div>
          )}
        </div>
      </div>

      {isHotTake && (
        <div
          style={{
            textAlign: "center",
            padding: "6px 0",
            fontFamily: "var(--font-space-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            color: "var(--red)",
            background: "rgba(155,27,27,0.06)",
          }}
        >
          🔥 HOT TAKE — DOUBLE POINTS 🔥
        </div>
      )}

      <div className={`timer-wrap ${tl > 0 ? "active" : ""}`}>
        <div className="timer-row">
          <span className="timer-lbl">DEADLINE</span>
          <span className={`timer-num ${timerClass}`}>
            {Math.ceil(timeLeft)}
          </span>
        </div>
        <div className="timer-track">
          <div
            className={`timer-bar ${timerClass}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      </div>

      <div className="edisplay">{question.cor.e.join(" ")}</div>

      <div className="qprompt-row">
        <div className="qprompt">
          Which headline does this emoji sequence represent?
        </div>
        <div className="kbh">Press or click 1&ndash;4 to answer.</div>
      </div>

      <div className="opts-wrap">
        <div className="opts">
          {question.opts.map((opt, i) => (
            <button
              key={opt.h}
              className={getButtonClass(opt)}
              disabled={answered}
              style={getButtonStyle(opt)}
              onClick={() => handleAnswer(opt.h)}
              data-testid={opt.h === correctH ? "correct-option" : "option"}
            >
              <span className="ol">{i + 1}</span>
              {opt.h}
            </button>
          ))}
        </div>
        {showFlash && (
          <div className="cflash">
            <div className="cfbig">&#10003; MATCH CONFIRMED</div>
          </div>
        )}
      </div>

      {opponents && opponents.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {opponents.map((opp) => (
              <div
                key={opp.playerName}
                style={{ position: "relative", display: "inline-flex" }}
              >
                <Avatar
                  emoji={opp.avatar.emoji}
                  bgColor={opp.avatar.bgColor}
                  size={28}
                />
                {opp.hasAnswered && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: "var(--green)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      color: "#fff",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: 11,
              color: "var(--mt)",
              marginTop: 6,
            }}
          >
            {answeredCount} of {totalOpponents} opponent
            {totalOpponents !== 1 ? "s" : ""} answered
          </div>
        </div>
      )}
    </div>
  );
}
