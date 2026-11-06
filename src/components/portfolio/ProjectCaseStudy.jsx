import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import BackLink from '../common/BackLink';
import SEO from '../common/SEO';
import LinkArrow from '../common/LinkArrow';
import WyndraShowcase from '../interactive/WyndraShowcase';
import {ProjectUserFlow,ProjectSystemFlow,ProjectOperations} from './ProjectDiagrams';
import RelatedProjects from './RelatedProjects';
import {projects} from '../../data/projects.js';
import {projectStories} from '../../data/projectStories.js';

function Screenshot({image}) {
  return <figure className="case-screenshot">
    <div className="case-screenshot-frame"><img src={image.src} alt={image.alt} loading="lazy" decoding="async"/></div>
    {image.caption&&<figcaption>{image.caption}</figcaption>}
  </figure>;
}

export default function ProjectCaseStudy({id}) {
  const project=projects.find(item=>item.id===id),story=projectStories[id];
  const {hash}=useLocation();
  const navigate=useNavigate();
  const article=useRef(null);
  const [active,setActive]=useState(()=>hash.slice(1)||'intro');
  const [indexHidden,setIndexHidden]=useState(false);
  const sections=[{id:'intro',label:'Intro'},...story.sections];
  useEffect(()=>{
    let frame;
    const update=()=>{
      frame=undefined;
      const targets=[...article.current.querySelectorAll('[data-case-section]')];
      let current=targets[0]?.id;
      for(const target of targets)if(target.getBoundingClientRect().top<=170)current=target.id;
      if(current)setActive(current);
      const lastSection=targets[targets.length-1];
      setIndexHidden(Boolean(lastSection&&lastSection.getBoundingClientRect().bottom<=170));
    };
    const schedule=()=>{if(frame===undefined)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    schedule();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[id]);
  const jump=(event,target)=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();setActive(target);
    navigate({hash:`#${target}`},{replace:true});
    document.getElementById(target)?.focus({preventScroll:true});
  };
  return <>
    <SEO title={`${project.title} — Product Development | Sri Villiam Sai`} description={`${project.description} An end-to-end product case study covering Sri’s role, interfaces, data flow and architecture.`} canonical={project.link}/>
    <div className="case-layout">
      <aside className="case-index" hidden={indexHidden} aria-label={`${project.title} case study navigation`}>
        <nav aria-label="Project sections"><ol>{sections.map(section=><li key={section.id}><a href={`#${section.id}`} onClick={event=>jump(event,section.id)} aria-current={active===section.id?'location':undefined}><span className="case-index-dash" aria-hidden="true"/><span className="case-index-label">{section.label}</span></a></li>)}</ol></nav>
      </aside>
      <article ref={article} className="case-article">
        <header id="intro" className="case-intro" data-case-section tabIndex={-1}>
          <BackLink className="case-back" to="/projects">All projects</BackLink>
          <p className="portfolio-eyebrow">{story.eyebrow}</p>
          <h1>{project.title}</h1>
          <p className="case-subtitle">{story.subtitle}</p>
          <dl className="case-meta">
            <div><dt>My role</dt><dd>{story.role}</dd></div>
            <div><dt>Platform</dt><dd>{story.platform}</dd></div>
            <div><dt>Project status</dt><dd>{project.status}</dd></div>
          </dl>
          <ul className="portfolio-tags" aria-label={`${project.title} technologies`}>{project.technologies.map(tech=><li key={tech}>{tech}</li>)}</ul>
          <div className="case-project-links">
            {project.demo&&<a href={project.demo} target="_blank" rel="noreferrer">{project.demoLabel}<LinkArrow/></a>}
            {project.source&&<a href={project.source} target="_blank" rel="noreferrer">Project source<LinkArrow/></a>}
            {project.relatedSource&&<a href={project.relatedSource} target="_blank" rel="noreferrer">{project.relatedSourceLabel}<LinkArrow/></a>}
          </div>
          <div className={`case-hero-screens ${story.hero.length===2?'has-two':''}`} aria-label={`${project.title} screen overview`}>{story.hero.map(image=><img key={image.src} src={image.src} alt={image.alt} decoding="async"/>)}</div>
        </header>
        {story.sections.map((section,index)=><section className="case-section" id={section.id} key={section.id} data-case-section tabIndex={-1} aria-labelledby={`${section.id}-heading`}>
          <p className="case-section-kicker">{String(index+1).padStart(2,'0')} / {section.label}</p>
          <h2 id={`${section.id}-heading`}>{section.title}</h2>
          <div className="case-section-copy">{section.body?.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div>
          {section.flow&&<ProjectUserFlow id={id}/>}
          {section.items&&<dl className="case-decisions">{section.items.map(item=><div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>}
          {section.image&&<Screenshot image={section.image}/>}
          {section.images&&<div className="case-image-pair">{section.images.map(image=><Screenshot key={image.src} image={image}/>)}</div>}
          {section.diagram&&<ProjectSystemFlow id={id}/>}
          {section.automation&&<ProjectOperations id={id}/>}
          {section.interactive==='weather-metrics'&&<div className="case-weather-preview"><WyndraShowcase/></div>}
        </section>)}

      </article>
    </div>
    <RelatedProjects currentId={id}/>
  </>;
}
