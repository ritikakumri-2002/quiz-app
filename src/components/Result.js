import React from "react";

export default function Result({ score, total, answers, highScore, onRestart }) {
  const ratio = score / total;
  const mood = ratio >= 0.7 ? "🎉" : ratio >= 0.4 ? "🤔" : "😭";
  return (
    <section className="result enter">
      <h2 className="score">
        {mood} You scored <span className="big">{score}</span> / {total}
      </h2>
      <p className="highscore">🏆 High score: <b>{highScore}</b></p>

      <ul className="review">
        {answers.map((a, i) => (
          <li key={i} className={`review-item ${a.isCorrect ? "ok" : "bad"}`}>
            <div className="review-q">{a.q}</div>
            <div className="review-a">
              {a.isCorrect ? "✅" : "❌"} Your: <b>{a.selected}</b>
              <span className="sep">·</span>
              Correct: <b>{a.correct}</b>
              {a.timedOut && <span className="timeout"> ⏳ timed out</span>}
            </div>
          </li>
        ))}
      </ul>

      <div className="actions">
        <button className="restart" onClick={onRestart}>Restart 🔁</button>
      </div>
    </section>
  );
}
