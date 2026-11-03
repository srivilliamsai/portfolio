import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found | Sri Villiam Sai" description="This page could not be found. Explore my projects or return to the portfolio." noIndex />
      <section className="bg-background section-padding-y" aria-labelledby="not-found-heading">
        <div className="container container-padding-x mx-auto information-page">
          <p className="portfolio-eyebrow">404</p>
          <h1 id="not-found-heading" className="heading-lg">Page not found</h1>
          <p>The link may have changed. You can still explore my work from here.</p>
          <div className="project-links">
            <Link className="portfolio-button" to="/">Back to home</Link>
            <Link className="portfolio-text-link" to="/#projects">View projects <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
