import React from 'react';
import LinkArrow from '../common/LinkArrow';
import { contributions, contributionsVerifiedOn } from '../../data/contributions';

function Contribution({ item }) {
  return (
    <article className="contribution-card">
      <div className="contribution-meta"><span className="portfolio-eyebrow">Merged · PR #{item.number}</span><time dateTime={item.mergedAt}>{new Date(`${item.mergedAt}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</time></div>
      <h3><a href={item.url} target="_blank" rel="noreferrer">{item.title} <LinkArrow /></a></h3>
      <p className="text-muted-foreground">{item.problem}</p>
      <details className="contribution-details"><summary>What I contributed</summary><p>{item.contribution}</p></details>
      <ul className="portfolio-tags" aria-label={`${item.title} technologies`}>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
    </article>
  );
}

export default function Contributions() {
  return (
    <section id="open-source" aria-labelledby="contributions-heading" className="portfolio-section bg-background section-padding-y border-b">
      <div className="container container-padding-x mx-auto">
        <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center contributions-heading">
          <p className="portfolio-eyebrow">Open source</p>
          <h2 id="contributions-heading" className="heading-lg">Building beyond my own projects</h2>
          <p className="text-muted-foreground">Five contributions merged into Workday’s public developer catalog. Explore an example, then open its pull request to see the work.</p>
        </div>
        <div className="contributions-grid">{contributions.slice(0, 3).map((item) => <Contribution key={item.number} item={item} />)}</div>
        <details className="more-contributions"><summary>Explore two more merged contributions</summary><div className="contributions-grid">{contributions.slice(3).map((item) => <Contribution key={item.number} item={item} />)}</div></details>
        <p className="contributions-verification text-muted-foreground">Upstream merge status verified <time dateTime={contributionsVerifiedOn}>2 November 2026</time>.</p>
      </div>
    </section>
  );
}
