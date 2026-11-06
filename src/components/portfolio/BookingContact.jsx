import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import BookCallLink from '../common/BookCallLink';
import Reveal from '../common/Reveal';
import { portfolio } from '../../data/portfolio';
import { validateContactNote } from '../../services/contactDraft';
import { deliverContactNote } from '../../services/contactDelivery';
import { useSound } from '../../context/SoundContext';

function ContactAvatar() {
  return <div className="reference-contact-avatar" aria-hidden="true"><img src="/static/media/logo-avatar.png" width="36" height="36" alt="" /></div>;
}
function Typing() {
  return <span className="reference-contact-bubble reference-contact-typing" role="status" aria-label="Sri is typing"><span /><span /><span /></span>;
}

export default function BookingContact() {
  const sheet = useRef(null);
  const compose = useRef(null);
  const noteInput = useRef(null);
  const timers = useRef([]);
  const mounted = useRef(false);
  const request = useRef(null);
  const endpoint = portfolio.contactFormUrl;
  const reduceMotion = useReducedMotion();
  const { playSound } = useSound('contact');
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [note, setNote] = useState('');
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('writing');
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [reply, setReply] = useState(false);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    if (!sheet.current) return;
    let timer, started = false, cancelled = false;
    const reveal = (index) => {
      if (cancelled) return;
      if (index === 4) { setTyping(false); return; }
      setTyping(true);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setShown(index + 1); setTyping(false); playSound('message');
        timer = window.setTimeout(() => reveal(index + 1), 350);
      }, 750);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        if (reduceMotion) setShown(4); else reveal(0);
      }
    }, { threshold: .15 });
    observer.observe(sheet.current);
    return () => { cancelled = true; clearTimeout(timer); observer.disconnect(); };
  }, [reduceMotion, playSound]);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; request.current?.abort(); timers.current.forEach(clearTimeout); };
  }, []);
  const later = (callback, delay) => { timers.current.push(window.setTimeout(callback, delay)); };

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(portfolio.email);
      setCopyStatus('Email copied');
    } catch { setCopyStatus('Use the email link to open your email app.'); }
    later(() => setCopyStatus(''), 3000);
  }
  async function foldNote(event) {
    event.preventDefault();
    if (phase !== 'writing' || request.current) return;
    const controller = new AbortController();
    try {
      validateContactNote({ recipient: portfolio.email, email, note });
      if (!endpoint) throw new Error('Direct sending is not connected yet. Please use the email link above.');
      request.current = controller;
      setError(''); setHeight(compose.current?.offsetHeight); setPhase('folding');
      playSound('shuffle');
      later(() => playSound('send'), reduceMotion ? 0 : 750);
      await Promise.all([
        deliverContactNote({ recipient: portfolio.email, email, note, endpoint }, { signal: controller.signal }),
        new Promise((resolve) => later(resolve, reduceMotion ? 0 : 1900)),
      ]);
      if (!mounted.current || controller.signal.aborted) return;
      setPhase('ready');
      later(() => { setReply(true); playSound('message'); }, reduceMotion ? 0 : 1050);
    } catch (failure) {
      if (request.current === controller) { timers.current.forEach(clearTimeout); timers.current = []; setCopyStatus(''); }
      if (mounted.current && !controller.signal.aborted) { setError(failure.message); setPhase('writing'); setHeight(null); }
    } finally { if (request.current === controller) request.current = null; }
  }
  function reset() {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPhase('writing'); setNote(''); setEmail(''); setReply(false); setHeight(null); setError('');
    later(() => noteInput.current?.focus(), 0);
  }

  return <section id="contact" aria-labelledby="contact-heading" className="reference-contact reference-palette border-b">
    <Reveal className="container container-padding-x mx-auto reference-contact-inner">
      <header className="reference-contact-heading">
        <p className="portfolio-eyebrow">CONTACT ME</p>
        <h2 className="heading-lg" id="contact-heading">Let's talk!</h2>
        <p className="text-muted-foreground">Feel free to reach out! I'm here to help and will respond within 24 hours. Your questions matter to me!</p>
      </header>
      <div className="reference-contact-sheet" ref={sheet}>
        <div className="reference-paper-holes" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</div>
        <div className="reference-contact-chat">
          <ContactAvatar />
          <div className="reference-contact-messages" aria-live="polite" aria-relevant="additions">
            {shown > 0 && <p className="reference-contact-bubble">Hey! Hiring, or have something to build? I’d love to hear about it.</p>}
            {shown > 1 && <div className="reference-contact-email"><p className="reference-contact-bubble">Email me at <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a></p><button type="button" className="reference-copy-email" aria-label="Copy email address" onClick={copyEmail}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></svg></button></div>}
            {shown > 2 && <div className="reference-contact-bubble reference-contact-invite"><p>Rather talk it through?</p><BookCallLink variant="invite" /></div>}
            {shown > 3 && <p className="reference-contact-bubble">Or leave me a note right here. <span aria-hidden="true">↓</span></p>}
            {typing && <Typing />}
          </div>
        </div>
        <p className="reference-copy-status" role="status">{copyStatus}</p>
        {shown > 3 && <div className="reference-contact-compose" ref={compose} data-phase={phase} style={phase === 'folding' && height ? { minHeight: height } : undefined}>
          {phase !== 'ready' ? <form onSubmit={foldNote} onKeyDown={(event) => { if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); event.currentTarget.requestSubmit(); } }}>
            <div className="reference-contact-slip" data-folding={phase === 'folding' || undefined}>
              <label htmlFor="contact-note" className="sr-only">Your note to Sri</label>
              <textarea id="contact-note" ref={noteInput} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Dear Sri…" rows="3" maxLength="1000" required readOnly={phase === 'folding'} />
              <label className="reference-contact-from"><span>From:</span><input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" maxLength="254" required readOnly={phase === 'folding'} /></label>
              {phase === 'folding' && ['bottom', 'top'].map((half) => <div className={`reference-fold-half reference-fold-${half}`} key={half} aria-hidden="true"><div className="reference-slip-face"><p className="reference-slip-text">{note}</p><p className="reference-contact-from">From: {email}</p></div></div>)}
            </div>
            <button className="reference-button reference-contact-send" type="submit" disabled={phase === 'folding' || !note.trim() || !email.trim()} data-custom-sound>Fold &amp; send <svg className="reference-contact-send-plane" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 21 4l-5.5 16-3.8-6.6L3 11.5Z" /><path d="M11.7 13.4 21 4" /></svg></button>
          </form> : <>
            <p className="reference-contact-bubble reference-contact-mine">{note}</p>
            <div className="reference-contact-chat reference-contact-reply" aria-live="polite"><ContactAvatar /><div className="reference-contact-messages">{reply ? <>
              <p className="reference-contact-bubble">Thanks! Your note has been submitted. I’ll reply to {email.trim()} soon.</p>
              <div className="reference-contact-draft-actions"><button type="button" onClick={reset} className="reference-underline">Write another note</button></div>
            </> : <Typing />}</div></div>
          </>}
          {phase === 'folding' && <svg className="reference-contact-plane" viewBox="0 0 48 48" aria-hidden="true" style={{ top: `${(height || 200) * .5}px` }}><path d="M4 23 44 6 33 42 25 28Z" fill="var(--reference-surface)" /><path d="M25 28 44 6 17 31Z" fill="var(--reference-fold)" /><path d="M4 23 44 6 33 42 25 28 17 31Z M25 28 44 6" fill="none" /></svg>}
          {phase === 'folding' && <p className="reference-contact-delivery-status" role="status">Sending your note…</p>}
          <p className="reference-contact-error" role="alert">{error}</p>
        </div>}
      </div>
    </Reveal>
  </section>;
}
