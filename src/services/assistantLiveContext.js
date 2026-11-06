import {projects} from '../data/projects.js';
import {projectStories,projectStoryText} from '../data/projectStories.js';
import {achievements} from '../data/achievements.js';
import {assistantMedia} from '../data/assistantMedia.js';
import {projectAvailability,availabilityText} from '../data/projectAvailability.js';
import {liveSpokenContext} from './assistantIdentity.js';

// The deployed token service may predate a frontend release. Send the same public
// case-study facts at session start so Live does not depend on model tool use.
export function livePortfolioContext(){
  const facts={
    projects:projects.map(project=>({id:project.id,name:project.title,summary:project.description,technology:project.technologies,scope:project.scope,details:projectStoryText(projectStories[project.id]),...(projectAvailability[project.id]?{availability:availabilityText(projectAvailability[project.id])}:{})})),
    achievements:achievements.map(item=>({id:item.slug,name:item.cardTitle,attribution:item.attribution||null,sections:item.sections.map(section=>({id:section.id,title:section.title,text:section.paragraphs.join(' ')}))})),
    pictures:assistantMedia.filter(item=>item.group==='personal'&&!item.placeholder).map(item=>({id:item.id,title:item.title,facts:item.reply})),
  };
  return liveSpokenContext('Public portfolio reference, not a request to answer. Use these approved case-study facts and search_portfolio for detailed questions; do not say architecture or compatibility is unspecified when it appears below. Lasora, Glasura and Glasora refer to Glassora. A brief question gets a brief answer. An explicit detailed or 500-word request overrides the short-answer preference: give the requested depth using distinct documented facts, preserving limits and attribution. For explain-more follow-ups add a new relevant section instead of repeating the summary. Platform families are not device-model or user counts. iPhone analysis and earphone analysis are ambiguous: ask whether the visitor means the iPhone app, F1 analysis, or headphones; do not silently choose F1. The owner’s full name is Shree William Sai; speak Shree as one word. Complete each sentence. Never speak internal media markers.\n'+JSON.stringify(facts));
}
