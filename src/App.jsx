import React, { lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SoundProvider } from './context/SoundContext';
import { ThemeProvider } from './context/ThemeContext';
import PortfolioRoutes from './app/PortfolioRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';

const pages = {
  Home,
  Projects: lazy(() => import('./pages/Projects')),
  Achievements: lazy(() => import('./pages/Achievements')),
  Certificates: lazy(() => import('./pages/Certificates')),
  AchievementDetail: lazy(() => import('./pages/AchievementDetail')),
  BlogIndex: lazy(() => import('./pages/BlogIndex')),
  BlogPost: lazy(() => import('./pages/BlogPost')),
  CarbonFootprint: lazy(() => import('./pages/projects/CarbonFootprint')),
  Glassora: lazy(() => import('./pages/projects/Glassora')),
  Pitstop: lazy(() => import('./pages/projects/Pitstop')),
  Wyndra: lazy(() => import('./pages/projects/Wyndra')),
  DineDesk: lazy(() => import('./pages/projects/DineDesk')),
  InvoicePicker: lazy(() => import('./pages/projects/InvoicePicker')),
  PrivacyPolicy: lazy(() => import('./pages/PrivacyPolicy')),
  TermsOfService: lazy(() => import('./pages/TermsOfService')),
  CookiesSettings: lazy(() => import('./pages/CookiesSettings')),
  FAQ: lazy(() => import('./pages/FAQ')),
  NotFound: lazy(() => import('./pages/NotFound')),
};

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <BrowserRouter>
          <ScrollToTop />
          <PortfolioRoutes pages={pages} />
        </BrowserRouter>
      </SoundProvider>
    </ThemeProvider>
  );
}
