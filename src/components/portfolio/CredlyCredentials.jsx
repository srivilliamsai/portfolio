import React from 'react';
import Reveal from '../common/Reveal';
import NoteStack from './NoteStack';
import { useSound } from '../../context/SoundContext';
import { credlySnapshotDate, credlyCredentials } from '../../data/credlyCredentials';

export default function CredlyCredentials(){
  const { playSound }=useSound('credentials');
  return <section id="credly-credentials" aria-labelledby="credly-title" className="credential-notes reference-palette">
    <Reveal className="credential-notes-intro section-title-gap-lg">
      <p className="portfolio-eyebrow">Beyond the certificates</p>
      <h2 id="credly-title" className="heading-lg">Badges & credentials</h2>
      <p className="text-muted-foreground">Explore all 113 Credly badges and 4 other credentials from my public profile. Click a card to see the next one.</p>
    </Reveal>
    <NoteStack items={credlyCredentials} getKey={item=>item.id} label="Credly badges and other credentials" itemLabel="Credential" nextLabel="Next credential" previousLabel="Previous credential" onMove={()=>playSound('shuffle')} className="credential-note-collection"
      renderCard={credential=><>
        <p className="reference-note-label">{credential.collection==='Credly'?'Credly badge':'Other credential'}</p>
        <div className="reference-note-logo credential-note-logo" aria-hidden="true"><img src={credential.image} alt="" width="64" height="64" loading="lazy" decoding="async" draggable={false}/></div>
        <p className="reference-note-body">{credential.title}</p>
        <div className="reference-note-from"><h3>{credential.issuer}</h3><p>{credential.dateLabel}</p>{credential.status&&<p className="credential-note-status">{credential.status} on Credly</p>}</div>
        <a className="reference-note-link reference-underline" href={credential.url} target="_blank" rel="noreferrer">{credential.collection==='Credly'?'View on Credly':'View issuer credential'} ↗</a>
      </>}
      footer={<p className="reference-notes-verification">Profile snapshot · <time dateTime={credlySnapshotDate}>5 November 2026</time></p>}/>
  </section>;
}
