import React from 'react';
import RollingArrow from './RollingArrow';
import { portfolio } from '../../data/portfolio';
export default function BookCallLink({ className = 'reference-button', onClick, variant = 'button' }) {
  const href = portfolio.bookingUrl || `mailto:${portfolio.email}?subject=${encodeURIComponent('Let’s arrange a 30-minute intro call')}`;
  const target = portfolio.bookingUrl ? { target: '_blank', rel: 'noreferrer' } : {};
  if (variant === 'invite') return <a className="reference-booking-card" href={href} onClick={onClick} {...target}>
    <span className="reference-booking-calendar" aria-hidden="true"><span>CALL</span><span>30</span></span>
    <span className="reference-booking-copy"><span>A 30-min intro call</span><span>{portfolio.bookingUrl ? 'Pick a time that suits you' : 'Let’s find a time by email'}</span></span>
    <span className="reference-button reference-booking-action">Book a call</span>
  </a>;
  return <a className={className} href={href} onClick={onClick} {...target}>Book a call{variant !== 'nav' && <RollingArrow diagonal />}</a>;
}
