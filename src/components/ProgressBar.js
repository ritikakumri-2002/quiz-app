import React from "react";

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`Progress ${current} of ${total}`}>
      <div className="bar" style={{ width: `${pct}%` }}>
        <span className="bar-label">{current} / {total}</span>
      </div>
    </div>
  );
}
