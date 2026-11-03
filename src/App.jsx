import React, { lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TerminalProvider } from './context/TerminalContext';
import PortfolioRoutes from './app/PortfolioRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';

const pages = {
  Home,
  BlogIndex: lazy(() => import('./pages/BlogIndex')),
  BlogPost: lazy(() => import('./pages/BlogPost')),
  CarbonFootprint: lazy(() => import('./pages/projects/CarbonFootprint')),
  Glassora: lazy(() => import('./pages/projects/Glassora')),
  Pitstop: lazy(() => import('./pages/projects/Pitstop')),
  Wyndra: lazy(() => import('./pages/projects/Wyndra')),
  PrivacyPolicy: lazy(() => import('./pages/PrivacyPolicy')),
  TermsOfService: lazy(() => import('./pages/TermsOfService')),
  CookiesSettings: lazy(() => import('./pages/CookiesSettings')),
  NotFound: lazy(() => import('./pages/NotFound')),
};

export default function App() {
  return (
    <ThemeProvider>
      <TerminalProvider>
        <BrowserRouter>
          <ScrollToTop />
          <PortfolioRoutes pages={pages} />
        </BrowserRouter>
      </TerminalProvider>
    </ThemeProvider>
  );
}
