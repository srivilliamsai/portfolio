import React from 'react';
import { Link } from 'react-router-dom';

export default function BackLink({ to, children = 'Back to home', className = '' }) {
  return <Link to={to} className={`portfolio-back-link${className ? ` ${className}` : ''}`}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M19 12H5m7-7-7 7 7 7" />
    </svg>
    <span>{children}</span>
  </Link>;
}
