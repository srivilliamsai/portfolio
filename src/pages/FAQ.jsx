import React from 'react';
import SEO from '../components/common/SEO';
import Reveal from '../components/common/Reveal';

export default function FAQ() {
  return <>
    <SEO title="FAQ | Sri Villiam Sai" description="Answers about my technical stack, development experience, and approach to building software." canonical="/faq" />
    <section className="bg-background section-padding-y border-b" aria-labelledby="faq-heading">
      <Reveal className="container container-padding-x mx-auto faq-page">
        <header className="faq-page-header">
          <div>
            <p className="portfolio-eyebrow">FAQ</p>
            <h1 className="heading-lg" id="faq-heading">Frequently asked questions</h1>
            <p className="text-muted-foreground">Answers about my stack, experience, and approach to building software.</p>
          </div>
          <a className="faq-resume-button" aria-label="Download resume" href="/static/media/resume.pdf" download target="_blank" rel="noreferrer">Resume</a>
        </header>
        <div className="faq-answer-grid">
          <article className="faq-answer">
                <h2 className="text-card-foreground text-base font-semibold font-mono">What is your core tech stack?</h2>
                <p className="text-muted-foreground text-base">
                  I specialize in Java and Spring Boot for robust backend services, paired with modern front-end
                  frameworks like React and HTML, CSS and JavaScript. I also have hands-on experience integrating
                  relational databases like MySQL.
                </p>
              </article>
          <article className="faq-answer">
                <h2 className="text-card-foreground text-base font-semibold font-mono">
                  Are you currently open to roles or internships?
                </h2>
                <p className="text-muted-foreground text-base">
                  Yes! I am actively seeking full-time roles or challenging internships where I can contribute to a team,
                  apply my full-stack knowledge, and continue growing as a developer.
                </p>
              </article>
          <article className="faq-answer">
                <h2 className="text-card-foreground text-base font-semibold font-mono">
                  What was your focus at Zidio Development?
                </h2>
                <p className="text-muted-foreground text-base">
                  During my time at Zidio, I focused on building and optimizing backend services. I worked within an
                  agile team to engineer scalable features using Java and Spring Boot.
                </p>
              </article>
          <article className="faq-answer">
                <h2 className="text-card-foreground text-base font-semibold font-mono">
                  How do you approach learning new technologies?
                </h2>
                <p className="text-muted-foreground text-base">
                  I believe in hands-on, project-based learning. My time in the Infosys Springboard program taught me how
                  to quickly adapt to new tools spanning the entire software development lifecycle.
                </p>
              </article>
          <article className="faq-answer">
                <h2 className="text-card-foreground text-base font-semibold font-mono">
                  Do you have experience with databases?
                </h2>
                <p className="text-muted-foreground text-base">
                  Absolutely. I am comfortable designing and querying relational databases, writing optimized SQL, and
                  integrating them seamlessly into dynamic web applications.
                </p>
              </article>
          <article className="faq-answer">
                <h2 className="text-card-foreground text-base font-semibold font-mono">
                  Can you work effectively in an Agile environment?
                </h2>
                <p className="text-muted-foreground text-base">
                  Yes, I am very familiar with agile methodologies. I thrive in collaborative environments, value clear
                  communication, and enjoy participating in sprints to deliver consistent value.
                </p>
              </article>
          <article className="faq-answer">
                <h2 className="text-card-foreground text-base font-semibold font-mono">
                  Do you have experience with iOS development?
                </h2>
                <p className="text-muted-foreground text-base">
                  In addition to full-stack web development, I am passionate about mobile development. I build native iOS
                  applications using Swift and SwiftUI, focusing on fluid animations and native Apple design patterns.
                </p>
              </article>
          <article className="faq-answer">
                <h2 className="text-card-foreground text-base font-semibold font-mono">
                  How do you approach leadership and teamwork?
                </h2>
                <p className="text-muted-foreground text-base">
                  I am deeply passionate about solving complex problems and taking initiative. Whether it's leading a
                  project phase or collaborating with peers, my goal is always to deliver impactful, user-centric
                  solutions while continuously learning.
                </p>
              </article>
        </div>
      </Reveal>
    </section>
  </>;
}
