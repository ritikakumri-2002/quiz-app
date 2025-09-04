import React, { useEffect, useMemo, useState } from "react";
import ProgressBar from "./components/ProgressBar";
import Question from "./components/Question";
import Result from "./components/Result";
import "./App.css";

const TIMER_SECONDS = 30;

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);    // current selection
  const [answers, setAnswers] = useState([]);        // {q, selected, correct, isCorrect, timedOut}
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [finished, setFinished] = useState(false);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("highScore") || 0));
  const total = questions.length;

  // load questions
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/questions.json");
        const data = await res.json();
        setQuestions(data.slice(0, 10)); // ensure 10
      } catch (e) {
        console.error("Failed to load questions", e);
      }
    })();
  }, []);

  // timer effect (resets per question)
  useEffect(() => {
    if (finished || total === 0) return;
    setTimeLeft(TIMER_SECONDS);
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, finished, total]);

  // when time hits 0, auto lock and go next
  useEffect(() => {
    if (timeLeft === 0 && !finished && total > 0) {
      handleLock(true); // timed out
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const score = useMemo(
    () => answers.reduce((s, a) => s + (a.isCorrect ? 1 : 0), 0),
    [answers]
  );

  const handleSelect = (opt) => setSelected(opt);

  const handleLock = (timedOut = false) => {
    const q = questions[idx];
    const sel = timedOut ? "⏳ Time up" : selected;
    const isCorrect = sel === q.answer;
    const entry = {
      q: q.question,
      selected: sel,
      correct: q.answer,
      isCorrect,
      timedOut
    };
    setAnswers((prev) => [...prev, entry]);
    setSelected(null);

    if (idx + 1 < total) {
      setIdx(idx + 1);
    } else {
      setFinished(true);
      // update high score
      const nextScore = answers.reduce((s, a) => s + (a.isCorrect ? 1 : 0), 0) + (isCorrect ? 1 : 0);
      if (nextScore > highScore) {
        localStorage.setItem("highScore", String(nextScore));
        setHighScore(nextScore);
      }
    }
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setAnswers([]);
    setTimeLeft(TIMER_SECONDS);
    setFinished(false);
  };

  if (total === 0) {
    return <div className="shell"><div className="card"><p>Loading…</p></div></div>;
  }

  return (
    <div className="shell" aria-live="polite">
      <div className={`card ${finished ? "card-float" : ""}`}>
        <header className="header">
          <h1 className="brand">TodayPay Quiz <span className="sparkle">✨</span></h1>
          {!finished && (
            <div className="topbar">
              <ProgressBar current={idx + 1} total={total} />
              <div className={`timer ${timeLeft <= 5 ? "panic" : ""}`} aria-label={`Time left ${timeLeft} seconds`}>
                ⏱️ {timeLeft}s
              </div>
            </div>
          )}
        </header>

        {!finished ? (
          <Question
            key={idx}                    // triggers enter animation on change
            data={questions[idx]}
            index={idx}
            total={total}
            selected={selected}
            onSelect={handleSelect}
            onLock={() => handleLock(false)}
            allowNext={selected !== null}
          />
        ) : (
          <Result
            score={score}
            total={total}
            answers={answers}
            highScore={highScore}
            onRestart={restart}
          />
        )}

        {/* simple confetti when finished & good score */}
        {finished && score >= Math.ceil(total * 0.7) && (
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, i) => <span key={i} />)}
          </div>
        )}
      </div>
      <footer className="footer">Made with ❤️ + ⚛️ — Keyboard: 1-4 to select, Enter to lock</footer>
    </div>
  );
}
