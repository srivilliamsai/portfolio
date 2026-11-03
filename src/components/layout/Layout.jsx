import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DevTerminal from '../terminal/DevTerminal';
import { useTerminal } from '../../context/TerminalContext';

export default function Layout() {
  const { isTerminalOpen } = useTerminal();
  return (
    <div className="__variable_5cfdac __variable_9a8899 antialiased min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex flex-1 flex-col" inert={isTerminalOpen}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Suspense fallback={<p className="container container-padding-x section-padding-y mx-auto" role="status">Loading page…</p>}><Outlet /></Suspense>
      </main>
      <Footer />
      </div>
      <DevTerminal />
    </div>
  );
}
