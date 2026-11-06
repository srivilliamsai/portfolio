import React from 'react';
import SEO from '../components/common/SEO';

export default function CookiesSettings() {
  return <>
    <SEO title="Cookies & browser storage | Sri Villiam Sai" description="Cookies and browser storage used by this portfolio." canonical="/cookies-settings" />
    <section className="bg-background section-padding-y border-b" aria-labelledby="cookies-heading">
      <article className="container container-padding-x mx-auto information-page">
        <p className="portfolio-eyebrow">Last updated: 6 November 2026</p>
        <h1 id="cookies-heading" className="heading-lg">Cookies & browser storage</h1>
        <p>This portfolio’s application code does not set cookies or use local storage for analytics, advertising, or visitor profiles. There are no application cookie preferences to configure.</p>
        <h2>Your browser, your preferences</h2>
        <p>The color theme follows your device’s appearance setting. Short sound effects are limited to Contact me, Open source, and the 404 page, and do not save a browser preference. Browsers may require an interaction before playing audio. The opening animation plays when you load the homepage and respects your device’s reduced-motion setting.</p>
        <h2>External websites</h2>
        <p>Following a project or social link opens a separate service. That service may use cookies or storage according to its own policies. Browser settings let you inspect or remove data stored by individual sites.</p>
        <p>For questions, email <a href="mailto:srivilliamsai@gmail.com">srivilliamsai@gmail.com</a>.</p>
      </article>
    </section>
  </>;
}
