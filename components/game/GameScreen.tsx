"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getTL, getRL } from "@/lib/game-logic";
import type { Headline, QuestionPick } from "@/types/game";

interface GameScreenProps {
  question: QuestionPick;
  roundNum: number;
  playerName: string;
  onAnswer: (chosen: string, correct: string) => void;
  onTimeUp: () => void;
  onRestart: () => void;
}

export default function GameScreen({
  question,
  roundNum,
  playerName,
  onAnswer,
  onTimeUp,
  onRestart,
}: GameScreenProps) {
  const [answered, setAnswered] = useState(false);
  const [chosenH, setChosenH] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canSkipAtRef = useRef(Infinity);
  const answeredRef = useRef(false);

  const tl = getTL(roundNum);
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
    [correctH, onAnswer]
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

  return (
    <div className="card" key={`q-${roundNum}`}>
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-score-item">
            <div className="card-score-val">
              {Math.min(roundNum, 50)}/50
            </div>
            <div className="card-score-lbl">Level</div>
          </div>
          <span
            className="card-restart"
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
          >
            &#8635; Start over
          </span>
        </div>
        <div className="player-info">
          <div className="player-name">{playerName}</div>
          <div className="player-title">{title}</div>
        </div>
      </div>

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
    </div>
  );
}
