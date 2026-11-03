import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { pageRoutes, legacyRedirects } from './routeCatalog';

// Shared by the browser app and server-render contract fixture. The browser
// registry may use lazy components while the fixture supplies synchronous ones.
export default function PortfolioRoutes({ pages }) {
  const MissingPage = pages.NotFound;
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {pageRoutes.map((route) => {
          const Page = pages[route.page];
          return route.index
            ? <Route key="home" index element={<Page />} />
            : <Route key={route.path} path={route.path} element={<Page />} />;
        })}
        {legacyRedirects.map((route) => <Route key={route.from} path={route.from} element={<Navigate to={route.to} replace />} />)}
        <Route path="*" element={<MissingPage />} />
      </Route>
    </Routes>
  );
}
