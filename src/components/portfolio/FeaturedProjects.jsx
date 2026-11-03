import React from 'react';
import LinkArrow from '../common/LinkArrow';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';

const stackedProjects = ['carbon-footprint', 'glassora'].map((id) => projects.find((project) => project.id === id));
const spotlightProject = projects.find((project) => project.id === 'pitstop');

function ProjectCard({ project, spotlight = false }) {
  return (
    <article className={`featured-project${spotlight ? ' featured-project-spotlight' : ''}`}>
      <Link to={project.link} className="featured-project-link" aria-labelledby={`featured-${project.id}`}>
        <div className="featured-project-content">
          <h3 id={`featured-${project.id}`}>{project.title} <LinkArrow /></h3>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <picture className="featured-project-cover">
          {spotlight && <source media="(min-width: 1024px)" srcSet={project.portraitCover} />}
          <img
            src={project.landscapeCover}
            alt={`${project.title} interface preview`}
            loading="lazy"
            decoding="async"
            width={spotlight ? '768' : '1200'}
            height={spotlight ? '432' : '655'}
          />
        </picture>
      </Link>
    </article>
  );
}

export default function FeaturedProjects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="portfolio-section bg-background section-padding-y border-b">
      <div className="container container-padding-x mx-auto flex flex-col gap-10 md:gap-12">
        <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
            Portfolio
          </div>
          <h2 id="projects-heading" className="heading-lg">Discover what I've created</h2>
          <p className="text-muted-foreground">
            Each piece reflects my passion for innovation and commitment to delivering high-quality results. Feel free
            to explore and get inspired!
          </p>
        </div>
        <div className="featured-project-grid">
          <ProjectCard project={spotlightProject} spotlight />
          <div className="featured-project-stack">
            {stackedProjects.map((project) => <ProjectCard project={project} key={project.id} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
