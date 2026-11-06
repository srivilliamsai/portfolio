import React from 'react';
import { Link } from 'react-router-dom';
import LinkArrow from '../common/LinkArrow';
import ProjectCard from './ProjectCard';
import { projects } from '../../data/projects';

const spotlightProject = projects.find(project => project.id === 'pitstop');
const stackedProjects = ['invoice-picker', 'glassora'].map(id => projects.find(project => project.id === id));

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
            {stackedProjects.map(project => <ProjectCard project={project} key={project.id} />)}
          </div>
        </div>
        <div className="featured-project-actions">
          <Link className="portfolio-text-link" to="/projects">View all projects <LinkArrow /></Link>
        </div>
      </div>
    </section>
  );
}
