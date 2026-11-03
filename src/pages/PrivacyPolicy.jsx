import React from 'react';
import SEO from '../components/common/SEO';

export default function PrivacyPolicy() {
  return <>
    <SEO title="Privacy Policy | Sri Villiam Sai" description="How this portfolio handles visitor information." canonical="/privacy-policy" />
    <section className="bg-background section-padding-y border-b" aria-labelledby="privacy-heading">
      <article className="container container-padding-x mx-auto information-page">
        <p className="portfolio-eyebrow">Last updated: 1 November 2026</p>
        <h1 id="privacy-heading" className="heading-lg">Privacy Policy</h1>
        <p>This portfolio presents Sri Villiam Sai’s work. You can explore it without creating an account or submitting personal information.</p>
        <h2>Interactive features</h2>
        <p>The developer terminal runs locally in your browser. Terminal commands are not sent to an AI service or stored by the application. Terminal history resets when the page is reloaded.</p>
        <h2>Hosting and connections</h2>
        <p>The hosting provider receives the information needed to deliver a web page, such as an IP address and requested URL. The portfolio does not include visitor analytics or advertising scripts.</p>
        <h2>Contact and external links</h2>
        <p>Email links open your email application. If you send an email, I receive the information you choose to include and use it to respond. Links to GitHub, LinkedIn, Credly, the App Store, and project demos take you to services with their own privacy practices.</p>
        <h2>Questions</h2>
        <p>Contact <a href="mailto:srivilliamsai@gmail.com">srivilliamsai@gmail.com</a> with questions about this portfolio.</p>
      </article>
    </section>
  </>;
}
