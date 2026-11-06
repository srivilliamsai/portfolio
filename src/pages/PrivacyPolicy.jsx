import React from 'react';
import SEO from '../components/common/SEO';

export default function PrivacyPolicy() {
  return <>
    <SEO title="Privacy Policy | Sri Villiam Sai" description="How this portfolio handles visitor information." canonical="/privacy-policy" />
    <section className="bg-background section-padding-y border-b" aria-labelledby="privacy-heading">
      <article className="container container-padding-x mx-auto information-page">
        <p className="portfolio-eyebrow">Last updated: 6 November 2026</p>
        <h1 id="privacy-heading" className="heading-lg">Privacy Policy</h1>
        <p>This portfolio presents Sri Villiam Sai’s work. You can explore it without creating an account or submitting personal information.</p>
        <h2>Interactive features</h2>
        <p>Sound effects in Contact me, Open source, and the 404 page play locally in your browser, using synthesis and a sound file hosted with the site. These sounds do not save a browser preference. The opening animation respects your device’s reduced-motion setting.</p>
        <h2>WILL voice and chat</h2>
        <p>WILL answers from the public portfolio locally when its cloud provider is not configured. Conversations stay in memory and reset on refresh. Voice input begins only when you choose it. Browser speech recognition may send audio to your browser’s speech service. When Google Gemini is configured, typed questions and recent WILL conversation context are sent to the assistant backend and Google; live voice sends microphone audio to Google while the microphone is active. End stops capture and playback. This application does not save audio recordings. External speech providers handle data under their own policies.</p>
        <h2>Hosting and connections</h2>
        <p>The hosting provider receives the information needed to deliver a web page, such as an IP address and requested URL. The portfolio does not include visitor analytics or advertising scripts.</p>
        <h2>Contact and external links</h2>
        <p>Email links open your email application. When direct delivery is configured, submitting the contact form sends your email address and note to Formspree so I can respond. If direct sending is unavailable or delivery cannot be confirmed, your note stays in the form and an error is shown; the form does not open your email application. The portfolio does not save your note in browser storage. If you send an email, I receive the information you choose to include and use it to respond. Booking links open Cal.com or Calendly when configured. Links to GitHub, LinkedIn, Credly, the App Store, and project demos take you to services with their own privacy practices.</p>
        <h2>Questions</h2>
        <p>Contact <a href="mailto:srivilliamsai@gmail.com">srivilliamsai@gmail.com</a> with questions about this portfolio.</p>
      </article>
    </section>
  </>;
}
