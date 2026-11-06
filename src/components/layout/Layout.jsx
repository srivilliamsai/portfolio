import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PortfolioIntro, { shouldShowIntro } from '../common/PortfolioIntro';
import { IntroContext } from '../../context/IntroContext';
import { useSound } from '../../context/SoundContext';
import { preloadAssistantGallery } from '../../services/assistantGallery';

let tourModule;
const loadTour = () => tourModule ??= import('../assistant/VillTour');
const VillTour = lazy(loadTour);

export default function Layout() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const { playSound } = useSound('will');
  const prepareAssistant = useCallback(() => { void loadTour(); void preloadAssistantGallery(); }, []);
  const openAssistant = useCallback(() => { playSound('open'); prepareAssistant(); setAssistantOpen(true); }, [playSound, prepareAssistant]);
  const { pathname } = useLocation();
  const closeAssistant = useCallback(() => setAssistantOpen(false), []);
  useEffect(() => { setAssistantOpen(false); }, [pathname]);
  const [introActive, setIntroActive] = useState(shouldShowIntro);
  const finishIntro = useCallback(() => setIntroActive(false), []);
  useEffect(() => {
    if (introActive) return;
    if (window.requestIdleCallback) {
      const idle = window.requestIdleCallback(prepareAssistant, { timeout: 1800 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = window.setTimeout(prepareAssistant, 600);
    return () => window.clearTimeout(timer);
  }, [introActive, prepareAssistant]);
  return (
    <div data-intro-active={introActive || undefined} className="portfolio-layout __variable_5cfdac __variable_9a8899 antialiased min-h-screen flex flex-col bg-background text-foreground">
      <IntroContext.Provider value={introActive}>
      <div className="flex flex-1 flex-col" inert={introActive || assistantOpen}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navbar onOpenAssistant={openAssistant} onPrepareAssistant={prepareAssistant} />
        <main id="main-content" tabIndex={-1} className="flex-1">
          <Suspense fallback={<p data-route-pending className="container container-padding-x section-padding-y mx-auto" role="status">Loading page…</p>}><Outlet /></Suspense>
        </main>
        <Footer />
      </div>
      </IntroContext.Provider>
      {assistantOpen && <Suspense fallback={<div className="vill-tour" role="status">Opening WILL…</div>}><VillTour onClose={closeAssistant} /></Suspense>}
      {introActive && <PortfolioIntro onComplete={finishIntro} />}
    </div>
  );
}
