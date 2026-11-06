import {assistantMedia} from '../data/assistantMedia.js';
import {projects} from '../data/projects.js';
import {projectStories} from '../data/projectStories.js';
import {projectOperations} from '../data/projectOperations.js';
import {canonicalQuery,resolveProjectId} from './assistantQuery.js';

const thirdPerson=text=>text.replace(/\bI (work|treat|use|build|connect|keep|describe|focus|learn|explore|develop|design)\b/g,(_,verb)=>`Villiam ${verb==='focus'?'focuses':verb+'s'}`).replace(/\bI have\b/g,'Villiam has').replace(/\bI’m\b/g,'Villiam is').replace(/\bI\b/g,'Villiam').replace(/\bMy\b/g,'His').replace(/\bmy\b/g,'his');
export function projectDetailReply(question,context={}) {
  const q=` ${canonicalQuery(question)} `;
  const named=projects.find(project=>project.id===resolveProjectId(question));
  if(!named&&/\bprojects\b/.test(q))return null;
  const project=named||(!/\b(school|college|education|degree|certificates|credly|languages|skills|birthplace|experience|messi|dhoni|naruto|mongodb)\b/.test(q)?projects.find(project=>project.id===context.topicId):null);
  if(!project)return null;
  const story=projectStories[project.id];
  const covered=new Set(context.topicId===project.id?(context.coveredSections||[]):[]);
  const follow=/^(?:(?:ok|okay|please|and) )*(?:tell me more|explain more|more|more details|go deeper|explain further|anything else)$/.test(q.trim());
  let section=story.sections.map(section=>({section,score:[section.label,section.id.replaceAll('-',' ')].reduce((score,alias)=>q.includes(` ${canonicalQuery(alias)} `)?Math.max(score,alias.length):score,0)})).filter(item=>item.score>0).sort((a,b)=>b.score-a.score)[0]?.section;
  if(!section&&follow)section=story.sections.find(item=>item.id!=='overview'&&!covered.has(item.id));
  if(!section&&follow)return {text:`That covers the additional ${project.title} details in this portfolio. Which part would you like to revisit?`,links:[{label:'Read the case study',href:project.link}],topicId:project.id,coveredSections:[...covered]};
  if(!section)return null;
  const parts=[...(section.body||[]),...(section.flow||[]).map(step=>`${step.title}: ${step.detail}`),...(section.items||[]).map(item=>`${item.title}: ${item.text}`),...(section.diagram?.layers||[]).map(layer=>`${layer.label}: ${layer.nodes.map(node=>`${node.title} — ${node.detail}`).join('; ')}`)];
  if(section.automation){const model=projectOperations[project.id];if(model)parts.push(...model.steps.map(step=>`${step.title}: ${step.detail||step.description||''}`));}
  const diagram=section.diagram;
  const explanation=diagram?`The flow goes from ${diagram.layers.map(layer=>layer.nodes.map(node=>node.title).join(' and ')).join(', then to ')}. ${diagram.caption||''}`:parts.join(' ')||section.title;
  const text=thirdPerson(explanation);
  covered.add(section.id);
  const media=assistantMedia.find(media=>media.entityId===project.id&&media.src===section.image?.src)||assistantMedia.find(media=>media.id===context.mediaId&&media.entityId===project.id)||assistantMedia.find(media=>media.entityId===project.id&&!media.placeholder);
  return {text:`${project.title} — ${section.label}. ${text}`,links:[{label:`${project.title}: ${section.label}`,href:`${project.link}#${section.id}`}],topicId:project.id,mediaId:media?.id||null,coveredSections:[...covered],tour:context.topicId===project.id?context.tour||null:null};
}
