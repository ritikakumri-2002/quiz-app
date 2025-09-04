import React, { useEffect, useRef } from "react";

export default function Question({ data, index, total, selected, onSelect, onLock, allowNext }) {
  const listRef = useRef(null);

  // keyboard accessibility: 1-4 to select, Enter to lock
  useEffect(() => {
    const handler = (e) => {
      if (e.key >= "1" && e.key <= "4") {
        const i = Number(e.key) - 1;
        if (data.options[i]) onSelect(data.options[i]);
      } else if (e.key === "Enter" && allowNext) {
        onLock();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data.options, onSelect, onLock, allowNext]);

  return (
    <section className="q-wrap enter">
      <div className="q-meta">Question {index + 1} of {total}</div>
      <h2 className="q-title" aria-live="polite">{data.question}</h2>

      <ul className="options" ref={listRef} role="listbox" aria-label="Options">
        {data.options.map((opt, i) => {
          const isSel = selected === opt;
          return (
            <li key={i}>
              <button
                className={`option ${isSel ? "selected" : ""}`}
                onClick={() => onSelect(opt)}
                aria-pressed={isSel}
                aria-label={`Option ${i+1}: ${opt}`}
              >
                <span className="index">{i + 1}</span>
                <span className="text">{opt}</span>
                <span className="emoji">{isSel ? "😎" : "🙂"}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="actions">
        <button className="next" onClick={onLock} disabled={!allowNext} aria-disabled={!allowNext}>
          {allowNext ? "Next ➜" : "Select an answer"}
        </button>
      </div>
    </section>
  );
}
