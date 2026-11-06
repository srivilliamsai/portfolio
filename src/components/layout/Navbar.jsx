import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import BookCallLink from '../common/BookCallLink';
import VillLauncher from '../assistant/VillLauncher';
import { navigation } from '../../data/portfolio';

export default function Navbar({ onOpenAssistant, onPrepareAssistant }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const { isDark } = useTheme();

  useEffect(() => setMobileMenuOpen(false), [pathname, hash]);

  return (
    <header className="portfolio-header">
      <nav aria-label="Main navigation" className="container container-padding-x mx-auto portfolio-nav">
        <Link to="/" aria-label="Sri Villiam Sai, home" className="portfolio-brand" onClick={() => setMobileMenuOpen(false)}>
          <img className="portfolio-brand-wordmark" src={isDark ? '/static/media/logo-wordmark.png' : '/static/media/logo-wordmark-light.png'} alt="Sri Villiam Sai" width="180" height="38" />
          <img className="portfolio-brand-avatar" src="/static/media/logo-avatar.png" alt="Sri Villiam Sai" width="32" height="32" />
        </Link>
        <VillLauncher onPrepare={onPrepareAssistant} className="vill-launcher-mobile" onOpen={() => { setMobileMenuOpen(false); onOpenAssistant(); }} />
        <button type="button" className="portfolio-menu-toggle" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="main-navigation-links" onClick={() => setMobileMenuOpen((open) => !open)}>
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></> : <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>}
          </svg>
        </button>
        <div id="main-navigation-links" className={`portfolio-nav-links ${mobileMenuOpen ? 'is-open' : ''}`}>
          {navigation.map((item) => <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>)}
          <VillLauncher onPrepare={onPrepareAssistant} className="vill-launcher-desktop" onOpen={() => { setMobileMenuOpen(false); onOpenAssistant(); }} />
          <BookCallLink variant="nav" className="portfolio-nav-contact" onClick={() => setMobileMenuOpen(false)} />
        </div>
      </nav>
    </header>
  );
}
