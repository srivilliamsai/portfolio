import React from 'react';
export default function RollingArrow({ diagonal = false }) {
  const arrow = diagonal ? '↗' : '→';
  return <span className="reference-rolling-arrow" aria-hidden="true"><span>{arrow}</span><span>{arrow}</span></span>;
}
