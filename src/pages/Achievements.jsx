import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import BackLink from '../components/common/BackLink';
import Reveal from '../components/common/Reveal';
import { achievements, achievementPath } from '../data/achievements';

export default function Achievements() {
  return <>
    <SEO title="Achievements | Sri Villiam Sai" description="A hackathon-winning machine learning project and a personal exploration of Formula 1 race analysis and championship predictions." canonical="/achievements" />
    <section className="achievement-index container container-padding-x mx-auto" aria-labelledby="achievements-heading">
      <Reveal>
        <BackLink to="/#about-me">Back to About me</BackLink>
        <header className="achievement-index-heading">
          <p className="portfolio-eyebrow">Milestones & explorations</p>
          <h1 id="achievements-heading" className="heading-xl">Achievements</h1>
          <p>From a hackathon challenge to a personal project. Two ways I’ve put my learning into practice.</p>
        </header>
        <div className="achievement-grid">
          {achievements.map((achievement) => {
            const cover = achievement.cardCover || achievement.cover;
            return <article className="achievement-card" key={achievement.slug}>
            <Link to={achievementPath(achievement)} className="achievement-card-link" aria-labelledby={'achievement-card-' + achievement.slug}>
              <div className="achievement-card-cover">
                <img src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" decoding="async" />
              </div>
              <div className="achievement-card-copy">
                <div className="achievement-card-meta">
                  <span className="achievement-badge">{achievement.category}</span>
                  {achievement.date && <time dateTime={achievement.date}>{achievement.dateLabel}</time>}
                </div>
                <h2 id={'achievement-card-' + achievement.slug}>{achievement.cardTitle}</h2>
                <p>{achievement.summary}</p>
                <span className="achievement-card-cta">Read the case study</span>
              </div>
            </Link>
          </article>;
          })}
        </div>
      </Reveal>
    </section>
  </>;
}
