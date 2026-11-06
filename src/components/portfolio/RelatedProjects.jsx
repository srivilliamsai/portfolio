import React from 'react';
import {Link} from 'react-router-dom';
import LinkArrow from '../common/LinkArrow';
import {projects} from '../../data/projects.js';

export default function RelatedProjects({currentId}) {
  return <section className="case-related-projects bg-background section-padding-y border-b" aria-labelledby="more-projects-heading" id="more-projects">
    <div className="container container-padding-x mx-auto">
      <header className="case-related-heading">
        <p className="portfolio-eyebrow">Portfolio</p>
        <h2 className="heading-lg" id="more-projects-heading">See my projects</h2>
        <p>Explore more of my product development work.</p>
      </header>
      <div className="case-related-grid" role="list">
        {projects.filter(project=>project.id!==currentId).map(project=><article key={project.id} role="listitem">
          <Link className="case-project-card" to={project.link} aria-labelledby={`related-${project.id}`}>
            <div className="case-project-description"><h3 id={`related-${project.id}`}>{project.title}<LinkArrow/></h3><p>{project.description}</p></div>
            <div className={`case-project-image ${project.coverIsScreenshot?'is-screenshot':''}`}><img src={project.landscapeCover} alt={project.coverAlt || `${project.title} product cover`} width="1200" height="655" loading="lazy" decoding="async"/></div>
          </Link>
        </article>)}
      </div>
    </div>
  </section>;
}
