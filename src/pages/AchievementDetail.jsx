import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/common/SEO';
import BackLink from '../components/common/BackLink';
import Reveal from '../components/common/Reveal';
import NotFound from './NotFound';
import { achievements, achievementPath, getAchievement } from '../data/achievements';

function CaseFigure({ figure, hero = false }) {
  return <figure className={'achievement-figure' + (hero ? ' achievement-hero-figure' : '')}>
    <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading={hero ? 'eager' : 'lazy'} decoding="async" />
    {figure.caption && <figcaption>{figure.caption}</figcaption>}
  </figure>;
}

function ModelComparison({ comparison }) {
  const reduction = (1 - comparison.selected.value / comparison.baseline.value) * 100;
  const format = (value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  return <figure className="achievement-comparison">
    <div className="achievement-comparison-heading">
      <h3>{comparison.title}</h3>
      <p>{comparison.context}</p>
    </div>
    <dl>
      {[comparison.baseline, comparison.selected].map((model) => <div className="achievement-score" key={model.label}>
        <dt>{model.label}</dt>
        <dd><span>{format(model.value)}</span><span className="achievement-score-unit">{comparison.unit}</span>
          <div className="achievement-score-track" aria-hidden="true"><span style={{ width: (model.value / comparison.baseline.value * 100) + '%' }} /></div>
        </dd>
      </div>)}
    </dl>
    <p className="achievement-score-reduction">{reduction.toFixed(2)}% lower RMSE than V9</p>
    <figcaption>{comparison.caption}</figcaption>
  </figure>;
}

function EvidenceTable({ table }) {
  return <div className="achievement-evidence">
    <div className="achievement-table-scroll" role="region" aria-label={table.caption} tabIndex={0}>
      <table>
        <caption>{table.caption}</caption>
        <thead><tr>{table.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
        <tbody>{table.rows.map((row) => <tr key={row[0]}>
          <th scope="row">{row[0]}</th>
          {row.slice(1).map((cell, index) => <td key={index}>{cell}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <p className="achievement-evidence-note">{table.note}</p>
  </div>;
}

export default function AchievementDetail() {
  const { slug } = useParams();
  const achievement = getAchievement(slug);
  if (!achievement) return <NotFound />;
  const next = achievements[(achievements.indexOf(achievement) + 1) % achievements.length];
  return <>
    <SEO title={achievement.title + ' | Sri Villiam Sai'} description={achievement.description} canonical={achievementPath(achievement)} />
    <article className="achievement-detail container container-padding-x mx-auto" aria-labelledby="achievement-heading" data-media-size={achievement.mediaSize}>
      <Reveal className="achievement-introduction">
        <BackLink to="/achievements">Back to achievements</BackLink>
        <header>
          <p className="portfolio-eyebrow">{achievement.category}</p>
          <h1 id="achievement-heading">{achievement.title}</h1>
          <p className="achievement-lead">{achievement.introduction}</p>
          {achievement.attribution && <p className="achievement-source">{achievement.attribution}</p>}
        </header>
        <dl className="achievement-facts">
          {achievement.facts.map((fact) => <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.date ? <time dateTime={fact.date}>{fact.value}</time> : fact.value}</dd>
          </div>)}
        </dl>
        <ul className="portfolio-tags achievement-technologies" aria-label="Technologies used">
          {achievement.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </Reveal>
      <Reveal><CaseFigure figure={achievement.cover} hero /></Reveal>
      <div className="achievement-story">
        {achievement.sections.map((section) => <section className="achievement-story-section" aria-labelledby={'achievement-' + section.id} key={section.id}>
          <Reveal className="achievement-story-copy">
            <p className="portfolio-eyebrow">{section.label}</p>
            <h2 id={'achievement-' + section.id}>{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </Reveal>
          {section.comparison && <Reveal><ModelComparison comparison={section.comparison} /></Reveal>}
          {section.table && <Reveal><EvidenceTable table={section.table} /></Reveal>}
          {[section.figure, ...(section.figures || [])].filter(Boolean).map((figure) => <Reveal key={figure.src}><CaseFigure figure={figure} /></Reveal>)}
        </section>)}
      </div>
      <nav className="achievement-next" aria-label="More achievements">
        <BackLink to="/achievements">Back to achievements</BackLink>
        <Link className="achievement-next-link" to={achievementPath(next)}>
          <span className="portfolio-eyebrow">Another achievement</span>
          <span>{next.cardTitle}</span>
        </Link>
      </nav>
    </article>
  </>;
}
