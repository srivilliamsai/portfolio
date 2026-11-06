import React from 'react';
import Reveal from '../common/Reveal';
import NoteStack from './NoteStack';
import { useSound } from '../../context/SoundContext';
import { contributions, contributionsVerifiedOn } from '../../data/contributions';

export default function Contributions() {
  const { playSound } = useSound('open-source');
  return <section id="open-source" aria-labelledby="contributions-heading" className="reference-contributions reference-palette border-b">
    <Reveal className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center contributions-heading reference-contributions-intro">
      <p className="portfolio-eyebrow">Open source</p>
      <h2 id="contributions-heading" className="heading-lg">Building beyond my own projects</h2>
      <p className="text-muted-foreground">Five contributions merged into Workday’s public developer catalog. Explore an example, then open its pull request to see the work.</p>
    </Reveal>
    <NoteStack items={contributions} getKey={item=>item.number} label="Merged contributions" itemLabel="Contribution" nextLabel="Next contribution" onMove={()=>playSound('shuffle')}
      footer={<p className="reference-notes-verification">Five merged pull requests. Verified <time dateTime={contributionsVerifiedOn}>2 November 2026</time>.</p>}
      renderCard={item=><>
            <p className="reference-note-label">A contribution to Workday · Merged PR #{item.number}</p>
            <div className="reference-note-logo" aria-hidden="true"><img src="/static/media/workday-logo.webp" alt="" width="92" height="44" /></div>
            <p className="reference-note-body">{item.contribution}</p>
            <div className="reference-note-from"><h3>{item.title}</h3><p>Workday developer catalog · <time dateTime={item.mergedAt}>{new Date(`${item.mergedAt}T00:00:00Z`).toLocaleDateString('en-GB',{month:'short',year:'numeric',timeZone:'UTC'})}</time></p></div>
            <a href={item.url} className="reference-note-link" target="_blank" rel="noreferrer">View merged pull request ↗</a>
      </>}/>
  </section>;
}
