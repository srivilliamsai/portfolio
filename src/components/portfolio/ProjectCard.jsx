import React from 'react';
import { Link } from 'react-router-dom';
import LinkArrow from '../common/LinkArrow';

export default function ProjectCard({ project, spotlight = false, headingAs: Heading = 'h3', idPrefix = 'featured' }) {
  const titleId = `${idPrefix}-${project.id}`;
  return (
    <article className={`featured-project${spotlight ? ' featured-project-spotlight' : ''}`}>
      <Link to={project.link} className="featured-project-link" aria-labelledby={titleId}>
        <div className="featured-project-content">
          <Heading id={titleId}>{project.title} <LinkArrow /></Heading>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <picture className="featured-project-cover">
          {spotlight && <source media="(min-width: 1024px)" srcSet={project.portraitCover} />}
          <img src={project.landscapeCover} alt={project.coverAlt || `${project.title} product cover`}
            loading="lazy" decoding="async" width="1200" height="655" />
        </picture>
      </Link>
    </article>
  );
}
