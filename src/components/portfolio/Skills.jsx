import React from 'react';
import RollingArrow from '../common/RollingArrow';
import { technicalSkills } from '../../data/technicalSkills';
import { scrollToSection } from '../../utils/scroll';

function SkillGlyph({ type }) {
  const shapes = {
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></>,
    network: <><rect x="8" y="3" width="8" height="5" rx="1" /><rect x="2" y="16" width="7" height="5" rx="1" /><rect x="15" y="16" width="7" height="5" rx="1" /><path d="M12 8v4H5.5v4M12 12h6.5v4" /></>,
    servers: <><rect x="2" y="3" width="20" height="6" rx="2" /><rect x="2" y="15" width="20" height="6" rx="2" /><path d="M6 6h.01M6 18h.01M12 6h6m-6 12h6M12 9v6" /></>,
  };
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[type]}</svg>;
}

export default function Skills() {
  return <section id="skills" aria-labelledby="skills-heading" className="portfolio-section skills-reference-section bg-background border-b border-border">
    <div className="skills-reference-inner">
      <header className="skills-reference-heading">
        <p className="portfolio-eyebrow">Skills / tech superpowers</p>
        <h2 id="skills-heading" className="heading-lg">Tools I build with</h2>
        <p className="text-muted-foreground">From Java services to cloud deployments, I learn a tool by making something with it.</p>
      </header>
      <ul className="skills-logo-grid" aria-label="Technical skills" style={{ '--skills-rest-4': 4 - technicalSkills.length % 4 }}>
        {technicalSkills.map(skill => <li className="skills-logo-cell" key={skill.name} title={`${skill.name} · ${skill.category}`}>
          <div className="skills-logo-content"><span className="skills-logo-mark">{skill.src ? <img src={skill.src} alt="" width="28" height="28" loading="lazy" decoding="async" /> : <SkillGlyph type={skill.glyph} />}<span>{skill.label || skill.name}{skill.detail && <small>{skill.detail}</small>}</span></span></div>
        </li>)}
        <li className="skills-logo-cell skills-contact-cell"><button type="button" onClick={() => scrollToSection('contact')}><span>Have a project in mind?</span><span>Let’s build it together <RollingArrow /></span></button></li>
      </ul>
    </div>
  </section>;
}
