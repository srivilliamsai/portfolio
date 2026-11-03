import React from 'react';
import LinkArrow from '../common/LinkArrow';
import { Link } from 'react-router-dom';
import { skillGroups } from '../../data/portfolio';

function SkillIcon({ number }) {
  const paths = {
    '01': <><rect x="4" y="3" width="16" height="7" rx="2" /><rect x="4" y="14" width="16" height="7" rx="2" /><path d="M8 6.5h.01M8 17.5h.01M12 6.5h4M12 17.5h4" /></>,
    '02': <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01M9 12l-3 2.5L9 17m6-5 3 2.5-3 2.5" /></>,
    '03': <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 5h4M11 19h2" /></>,
    '04': <><path d="M7 17a4 4 0 0 1-.8-7.92 6 6 0 0 1 11.56-1.4A4.7 4.7 0 0 1 18 17M12 12v9m-3-3 3 3 3-3" /></>,
  };

  return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[number]}</svg>;
}

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="portfolio-section bg-background section-padding-y border-b">
      <div className="container container-padding-x mx-auto">
        <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center skills-heading">
          <p className="portfolio-eyebrow">Skills / tech superpowers</p>
          <h2 id="skills-heading" className="heading-lg">Tools I build with</h2>
          <p className="text-muted-foreground">From Java services to native iOS screens, I learn a tool by making something with it.</p>
        </div>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article className="skill-card" key={group.title} aria-labelledby={`skill-${group.number}`}>
              <div className="skill-card-top">
                <span className="skill-card-icon"><SkillIcon number={group.number} /></span>
                <span className="portfolio-eyebrow" aria-hidden="true">{group.number}</span>
              </div>
              <div className="skill-card-summary">
                <h3 id={`skill-${group.number}`}>{group.title}</h3>
                <p className="text-muted-foreground">{group.description}</p>
              </div>
              <ul className="portfolio-tags skill-card-skills" aria-label={`${group.title} skills`}>
                {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
              <Link className="portfolio-text-link skill-card-link" to={`/${group.project}`}>{group.evidence} <LinkArrow /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
