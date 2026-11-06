import {canonicalOwnerQuery} from './assistantIdentity.js';

export const normalize=text=>String(text||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();

// Correct only a small, explicit vocabulary of portfolio terms, not biography.
const aliases={skill:'skills',project:'projects',projet:'projects',projets:'projects',proejct:'projects',proejcts:'projects',projcet:'projects',projcets:'projects',prject:'projects',prjects:'projects',language:'languages',langauge:'languages',langauges:'languages',languges:'languages',certificate:'certificates',certification:'certificates',credential:'credentials',certifcate:'certificates',certifcates:'certificates',achievement:'achievements',achivement:'achievements',achivements:'achievements',award:'awards',contribution:'contributions',hobbie:'hobbies',hobies:'hobbies'};
export const canonicalQuery=text=>canonicalOwnerQuery(normalize(text)).split(' ').map(word=>aliases[word]||({architechture:'architecture',archtecture:'architecture',archtect:'architecture',artctect:'architecture',architectue:'architecture'}[word])||word).join(' ');

// Owner-reported speech transcriptions and the products' documented purposes.
// Keep this vocabulary shared by routing, retrieval and section answers.
export const projectQueryAliases={
  pitstop:['pitstop','pit stop','it stop','roadside assistance','roadside app'],
  'carbon-footprint':['carbon footprint','carbon','sustainability project','emissions tracker'],
  wyndra:['wyndra','wyndra weather','weather app','weather project','weather application','van drop','wyendra','w y n d r a','w y e n d r a'],
  glassora:['glassora','glass sora','kasora','black sora','glacier','glycerol','wallpaper','wallpapers'],
  dinedesk:['dinedesk','dine desk','tiny desk','daily des','restaurant pos','restaurant operations','restaurant billing'],
  'invoice-picker':['invoice picker','invoicepicker','invoice speaker','invoicing app','invoice project','freelancer invoicing'],
};
export function resolveProjectId(question) {
  const q=` ${canonicalQuery(question)} `;
  const matches=Object.entries(projectQueryAliases).filter(([,aliases])=>aliases.some(alias=>q.includes(` ${canonicalQuery(alias)} `)));
  return matches.length===1?matches[0][0]:null;
}
