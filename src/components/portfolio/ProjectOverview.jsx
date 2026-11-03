import React from 'react';
import { projects } from '../../data/projects';

export default function ProjectOverview({ id }) {
  const project = projects.find((item) => item.id === id);
  return (
    <section className="bg-background border-b section-padding-y" aria-labelledby={`${id}-build-notes`}>
      <div className="container container-padding-x mx-auto">
        <p className="portfolio-eyebrow">{project.status}</p>
        <h2 id={`${id}-build-notes`} className="heading-lg project-overview-heading">Build notes</h2>
        <div className="project-overview">
          <div><h3>The problem</h3><p>{project.description}</p></div>
          <div><h3>My contribution</h3><p>{project.contribution}</p></div>
          <div><h3>The tools</h3><ul className="portfolio-tags" aria-label={`${project.title} build tools`}>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
        </div>
        <p className="project-scope">{project.scope}</p>
        {(project.source || project.demo || project.relatedSource) && <div className="project-links project-overview-links">
          {project.source && <a className="portfolio-text-link" href={project.source} target="_blank" rel="noreferrer">Project source <span aria-hidden="true">↗</span></a>}
          {project.demo && <a className="portfolio-text-link" href={project.demo} target="_blank" rel="noreferrer">{project.demoLabel} <span aria-hidden="true">↗</span></a>}
          {project.relatedSource && <a className="portfolio-text-link" href={project.relatedSource} target="_blank" rel="noreferrer">{project.relatedSourceLabel} <span aria-hidden="true">↗</span></a>}
        </div>}
      </div>
    </section>
  );
}
