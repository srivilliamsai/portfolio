import React from 'react';
import BackLink from '../components/common/BackLink';
import SEO from '../components/common/SEO';
import ProjectCard from '../components/portfolio/ProjectCard';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <>
      <SEO title="Projects | Sri Villiam Sai"
        description="Explore Sri Villiam Sai’s six product development projects across web applications, native iOS and SaaS."
        canonical="/projects" />
      <section aria-labelledby="all-projects-heading" className="bg-background section-padding-y border-b">
        <div className="container container-padding-x mx-auto">
          <header className="projects-index-heading">
            <BackLink to="/#projects" />
            <p className="portfolio-eyebrow">Portfolio</p>
            <h1 id="all-projects-heading" className="heading-xl">All projects</h1>
            <p className="text-muted-foreground">Web applications, native iOS apps, and products I’m building end to end.</p>
          </header>
          <div className="featured-project-grid projects-index-grid" aria-label="All projects">
            {projects.map(project => <ProjectCard project={project} key={project.id} headingAs="h2" idPrefix="project" />)}
          </div>
        </div>
      </section>
    </>
  );
}
