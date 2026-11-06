import {displayOwnerName,withOwnerName} from './assistantIdentity.js';
import { portfolio } from '../data/portfolio.js';
import { projects } from '../data/projects.js';
import { projectStories, projectStoryText } from '../data/projectStories.js';
import { achievements } from '../data/achievements.js';
import { certificates } from '../data/certificates.js';
import { contributions } from '../data/contributions.js';
import { experience } from '../data/experience.js';
import { technicalSkills } from '../data/technicalSkills.js';
import { products, interests } from '../data/assistantContent.js';
import { assistantMedia } from '../data/assistantMedia.js';
import {canonicalQuery,normalize,projectQueryAliases,resolveProjectId} from './assistantQuery.js';
import {conversationRecords,conversationReply} from './assistantConversation.js';
import {projectDetailReply} from './assistantProjectDetails.js';
import {achievementReply,resolveAchievementId} from './assistantAchievements.js';
import {formatRequestedReply} from './assistantAnswerFormat.js';
import {personalReply} from './assistantInterests.js';
import {sanitizeAssistantContext} from './assistantContext.js';
import {profileRecords,profileReply,educationAnswer} from './assistantProfile.js';
import {backgroundExperience} from '../data/assistantProfile.js';
import {requestReply} from './assistantRequests.js';
import {musicReply} from './assistantMusic.js';
import {assistantMusic} from '../data/assistantMusic.js';
import {projectAvailability,availabilityText} from '../data/projectAvailability.js';
export {normalize} from './assistantQuery.js';

export const welcome = displayOwnerName("Hi, I'm WILL! What would you like to know about Villiam?");
const mediaFor = id => assistantMedia.filter(m => m.entityId === id && !m.placeholder).map(m => m.id);
const projectAliases = { pitstop:['pit stop','roadside','fuel'], 'carbon-footprint':['carbon footprint','carbon','sustainability','emissions'], wyndra:['weather','ios weather'], glassora:['wallpaper','wallpapers'] };
export const knowledgeRecords = [
  ...Object.entries(projectAvailability).map(([id,value])=>({id:`${id}-availability`,title:`${id} compatibility and version`,aliases:[`${id} compatibility`,`${id} targeted version`,`${id} platforms`],text:availabilityText(value),links:[{label:'App Store compatibility and version',href:value.source}],mediaIds:mediaFor(id)})),
  {id:'music',title:'Music selection',aliases:['songs','music','spotify','playlist',...assistantMusic.map(item=>item.title)],text:`Music selected for this portfolio: ${assistantMusic.map(item=>item.title).join(', ')}. Listening history and personal stories behind these tracks are not supplied.`,links:[],mediaIds:assistantMusic.map(item=>item.id)},
  ...conversationRecords,
  ...profileRecords,
  { id:'assistant', title:'WILL', aliases:['will','your name','your full name','who are you','what are you','assistant'], text:'My name is WILL. I’m the portfolio assistant for Sri Villiam Sai, a product developer building web, iOS, and SaaS products. I can explain his projects, skills, background, certificates and gallery photos. I’m an AI assistant, not Sri himself.', links:[], mediaIds:[] },
  { id:'about', title:portfolio.name, aliases:['about','who is sri','background','introduce','sri villiam sai','his full name','his name'], text:`Sri Villiam Sai is a product developer who builds web and native iOS applications end to end, from frontend interfaces to backend and data-service integration. He completed a B.Tech. in Information Technology at ${portfolio.education.institution} and is currently pursuing ${portfolio.currentEducation.qualification} at ${portfolio.currentEducation.institution} (${portfolio.currentEducation.period}, expected completion in ${portfolio.currentEducation.expectedGraduation}). He learns by building, using Java to explore backend behaviour and SwiftUI to explore how a product feels to use.`, links:[{label:'About Sri',href:'/#about-me'}], mediaIds:[] },
  { id:'education',title:'Education',aliases:['education','degree','studying','college','university','qualification'],text:educationAnswer,links:[{label:'About Sri',href:'/#about-me'}],mediaIds:[] },
  { id:'skills',title:'Technical skills',aliases:['skills','stack','technologies','tools','programming','languages'],text:`Sri's selected technical skills include ${technicalSkills.map(s=>s.name).join(', ')}. His project-specific stacks are documented with each project.`,links:[{label:'Explore skills',href:'/#skills'}],mediaIds:[] },
  { id:'experience',title:'Experience',aliases:['experience','internship','intern','zidio','infosys','jobs','career'],text:[...backgroundExperience,...experience].map(e=>`${e.role} at ${e.organization}, ${e.period}. ${e.summary}`).join('\n\n'),links:[{label:'About Sri',href:'/#about-me'}],mediaIds:[] },
  { id:'contact',title:'Contact Sri',aliases:['contact','email','hire','hiring','reach','book','call','linkedin','github','connect'],text:`You can reach Sri at ${portfolio.email}, explore his GitHub or LinkedIn, or book a 30-minute call.`,links:[{label:'Email Sri',href:`mailto:${portfolio.email}`},{label:'Book a call',href:portfolio.bookingUrl},{label:'LinkedIn',href:portfolio.linkedin},{label:'GitHub',href:portfolio.github}],mediaIds:[] },
  { id:'interests',title:'Outside work',aliases:['interests','hobbies','outside work','free time','fun','enjoy'],text:`Sri enjoys ${interests.filter(i=>i.id!=='mongodb-event').map(i=>i.title).join(', ')}. He has also attended MongoDB.local, and likes learning new technologies and exploring different kinds of software.`,links:[],mediaIds:[] },
  ...interests.map(i=>({id:`interest:${i.id}`,title:i.title,aliases:[i.title,i.id,...(i.aliases||[]),...(i.id==='messi'?['lionel','favorite footballer','favourite footballer']:i.id==='f1'?['formula 1','formula one']:i.id==='bike-rides'?['bike','motorcycle','riding']:[])],text:i.fact,links:[],mediaIds:[...new Set([...(i.mediaIds||[]),...assistantMedia.filter(m=>m.entityId===`interest:${i.id}`).map(m=>m.id)])]})),
  ...products.map(p=>({id:p.id,title:p.name,aliases:[p.name,...(projectQueryAliases[p.id]||[]),...(p.id==='dinedesk'?['dine desk','restaurant pos','restaurant billing','billing software']:['invoicepicker','invoice picker','invoice software','freelancer invoicing'])],text:`${p.summary}\n\n${p.features.map(f=>`${f.title}: ${f.description}`).join('\n')}\n\nSri's work: ${p.contributions.join(' ')}\n\nTechnology: ${p.technologies.join(', ')}.\nStatus: ${p.status}.\n\n${projectStoryText(projectStories[p.id])}`,features:p.features,summary:p.summary,technologies:p.technologies,boundaries:p.boundaries,links:[{label:'Read the case study',href:`/${p.id}`},...(p.publicUrl?[{label:`Visit ${p.name}`,href:p.publicUrl}]:[])],mediaIds:mediaFor(p.id),status:p.status})),
  ...projects.filter(p=>!products.some(product=>product.id===p.id)).map(p=>({id:p.id,title:p.title,aliases:[p.title,...(projectQueryAliases[p.id]||[]),...(projectAliases[p.id]||[])],text:`${p.description} ${p.contribution}\n\nTechnology: ${p.technologies.join(', ')}.\n${p.scope}\n\n${projectStoryText(projectStories[p.id])}`,features:projectStories[p.id].sections.find(section=>section.flow)?.flow.map(step=>({title:step.title,description:step.detail})),summary:`${p.title}: ${p.description} ${p.contribution.replace(/^Product developer responsible for /,'Villiam built ').replace(/^Product developer across /,'Villiam worked across ')}`,technologies:p.technologies,links:[{label:'Read the case study',href:p.link},...(p.demo?[{label:p.demoLabel||'View demo',href:p.demo}]:[])],mediaIds:mediaFor(p.id)})),
  ...achievements.map(a=>({id:a.slug,title:a.cardTitle||a.title,aliases:[a.cardTitle||a.title,...(a.slug==='restaurant-turnover-prediction'?['hackathon','restaurant turnover','rank','winner']:['f1 case study','formula 1 case study','formula one case study','f1 analysis','f1 achievements','championship','forecast','bedrock'])],text:`${a.introduction}\n${a.facts?.map(f=>`${f.label}: ${f.value}`).join('. ')||''}${a.attribution?`\nAttribution: ${a.attribution} This is an attributed case study; do not claim the source author's system or forecast as Sri's own.`:''}`,summary:a.introduction+(a.attribution?' Attribution: '+a.attribution:''),links:[{label:'Read the case study',href:`/achievements/${a.slug}`}],mediaIds:mediaFor(a.slug)})),
  ...certificates.map(c=>({id:`cert:${c.id}`,title:c.title,aliases:[c.title,c.issuer],text:`${c.title} — ${c.issuer}. ${c.kind}. Issued ${c.issued}.${c.validUntil?` Valid until ${c.validUntil}.`:''}${c.note?` ${c.note}`:''}`,links:[{label:'View certificate',href:c.src},{label:'Certificates',href:'/certificates'}],mediaIds:[`certificate:${c.id}`],certificate:true})),
  ...contributions.map(c=>({id:`contribution:${c.number}`,title:c.title,aliases:[c.title,'workday','open source'],text:`${c.title}: ${c.contribution} Merged into ${c.repository} on ${c.mergedAt}.`,links:[{label:'View merged pull request',href:c.url}],mediaIds:[]})),
].map(withOwnerName);
export function getMedia(id) { const media=assistantMedia.find(m=>m.id===id);return media?withOwnerName(media):null; }
// Providers receive conversational context, not asset provenance or file metadata.
export function getMediaContext(id) {
  const media=getMedia(id);
  return media?{id:media.id,entityId:media.entityId,title:media.title,description:media.reply||media.description,placeholder:media.placeholder,...(media.kind==='song'?{kind:'song',spotifyUrl:media.spotifyUrl}:{})}:null;
}
export function searchKnowledge(query, limit=4) {
  const q=canonicalQuery(query), tokens=q.split(' ').filter(t=>t.length>2&&!/^(what|how|many|does|did|has|have|his|her|she|you|your|tell|about|can|could|please|the|and|for|with|this|that)$/.test(t));
  if(!q) return [];
  return knowledgeRecords.map(r=>{
    const title=canonicalQuery(r.title), aliases=[...new Set(r.aliases.map(canonicalQuery))], body=canonicalQuery(r.text);
    let score=r.id===resolveProjectId(query)||r.id===resolveAchievementId(query)?45:0;
    score+=(` ${q} `).includes(` ${title} `)?30:0;
    score+=aliases.reduce((n,a)=>n+(a===q?30:a.length>=2&&(` ${q} `).includes(` ${a} `)?12:0),0);
    if(r.certificate&&/\b(certificates|certifications|credentials|certified)\b/.test(q)&&aliases.some(alias=>(` ${q} `).includes(` ${alias} `)))score+=40;
    score+=tokens.reduce((n,t)=>n+(title.includes(t)?3:0)+(body.includes(t)?0.25:0),0);
    return {record:r,score};
  }).filter(r=>r.score>=2).sort((a,b)=>b.score-a.score).slice(0,limit).map(r=>r.record);
}
export function localReply(question, context={}) {
  const safe=sanitizeAssistantContext(context),reply=formatRequestedReply(question,safe,answerLocal(question,safe));
  return withOwnerName({...reply,tour:Object.hasOwn(reply,'tour')?reply.tour:reply.topicId===safe.topicId?safe.tour||null:null});
}
function answerLocal(question, context={}) {
  const q=canonicalQuery(question);
  const request=requestReply(question,context);if(request)return request;
  const music=musicReply(question,context);if(music)return music;
  const selected=getMedia(context.mediaId);
  if(/\b(put (it |that |the photo )?back|hide (the )?(photo|image|picture)|dismiss (the )?(photo|image|picture))\b/.test(q))return {text:'Picture put back. What would you like to explore next?',links:[],clearMedia:true,dismissMedia:true,topicId:context.topicId||null};
  const explicitWork=knowledgeRecords.some(record=>(projects.some(project=>project.id===record.id)||record.id.startsWith('background:'))&&record.aliases.some(alias=>(` ${q} `).includes(` ${canonicalQuery(alias)} `)));
  const isPhoto=!explicitWork&&!/\b(languages|stack|technologies|technology|pricing|salary|education|degree|college|university|born|birthplace|school|mtech|btech|internship|projects|certificates)\b/.test(q)&&(/\b(picture|photo|image|screen)\b/.test(q)&&/\b(what|tell|describe|explain|who|where|when|this|that)\b/.test(q)||/^(who|what|where|when) (is|s|was) (in )?(this|that)( person| one)?$/.test(q)||/\b(tell me about|describe|explain) (this|that)\b/.test(q)||/^is (this|that) sri$/.test(q)||/\b(when|where)\b/.test(q)&&/\b(this|that)\b/.test(q));
  if(isPhoto&&selected?.placeholder) return {text:selected.description,links:[],mediaId:selected.id,topicId:context.topicId||null};
  if(/^(hi|hello|hey|hey there|hi there|hello there|good morning|good afternoon|good evening)( will)?$/.test(q)) return {text:'Hi! Would you like to explore Sri’s projects or get to know him a little?',links:[],topicId:context.topicId||null};
  if(/^(how are you|how are you doing|how s it going|how do you do)( will)?$/.test(q)) return {text:'I’m ready to help. What would you like to know about Sri or his work?',links:[],topicId:context.topicId||null};
  if(/^(thanks|thank you|thank you will|thanks will|cheers|great thanks)$/.test(q)) return {text:'You’re welcome! Anything else you’d like to explore?',links:[],topicId:context.topicId||null};
  if(/^(help|start|what can you do|how can you help|can you help me)$/.test(q)) return {text:'I can walk you through Sri’s projects, explain his skills and experience, show certificates, or tell you about a picture. What interests you?',links:[],topicId:context.topicId||null};
  if(/\byour (full |real )?name\b|^(who are you|what are you|tell me about yourself|introduce yourself)( will)?$/.test(q)) return {text:`My name is WILL. I’m the portfolio assistant for ${portfolio.name}.`,links:[],topicId:'assistant'};
  if(/\b(are you sri|are you (a )?(human|person|real person))\b/.test(q)) return {text:`I’m WILL, an AI portfolio assistant. ${portfolio.name} is the product developer whose work you’re exploring.`,links:[],topicId:'assistant'};
  if(/^(?:(?:ok|okay|please|can you) )*(?:(?:what is|what s|tell me|tell me the) )?(?:(?:the|his|my|sri|sri s|the owner s|the developer s) )?(?:full|real) name(?: of (?:sri|the owner|the developer))?(?: only)?$/.test(q))return {text:portfolio.name,links:[],topicId:'about',clearMedia:true,answerFormat:'names-only',answerScope:'owner'};
  if(/^(full name|his (full |real )?name|sri s (full |real )?name|what is (his|sri s) (full |real )?name|what s (his|sri s) (full |real )?name|who is sri|who is sri villiam sai|who built (this|this website|this portfolio))$/.test(q)) return {text:`His full name is ${portfolio.name}. He’s a product developer building web, iOS, and SaaS products.`,links:[{label:'About Sri',href:'/#about-me'}],topicId:'about'};
  const achievement=achievementReply(question,context);
  if(achievement)return achievement;
  const personal=personalReply(question,context);
  if(personal)return personal;
  if(/^(?:(?:ok|okay|please|can you|could you) )*(?:show|open|display)(?: me)?(?: the|this|that|an|any|a)? (?:image|photo|picture|screen)(?: please)?$/.test(q)){
    const record=knowledgeRecords.find(item=>item.id===(selected?.entityId||context.topicId));
    const media=selected||getMedia(record?.mediaIds?.[0]);
    if(media)return {text:media.reply||record?.summary||media.description,links:[],mediaId:media.id,topicId:media.entityId||context.topicId||null,tour:null};
    return {text:'Which image would you like: Villiam’s portraits, a project screenshot, or an interest picture such as F1 or Naruto?',links:[],topicId:context.topicId||null,needsClarification:true};
  }
  const detail=projectDetailReply(question,context);
  if(detail)return detail;
  const background=profileReply(question,context);
  if(background)return background.topicId==='pitstop'?{...background,mediaId:mediaFor('pitstop')[0]||null,clearMedia:false}:background;
  if(isPhoto&&selected?.group==='personal'&&selected.reply) {
    const unknown=/\b(where|location|place|taken at)\b/.test(q)?'I don’t have the location for this photo.':/\b(when|date|year)\b/.test(q)?'I don’t have a date for this photo.':null;
    return {text:unknown||selected.reply,links:[],mediaId:selected.id,topicId:selected.entityId||context.topicId||null};
  }
  const conversational=conversationReply(question,context);
  if(conversational)return conversational;
  if(/\b(salary|net worth|age|birthday|birth date|home address|phone number)\b/.test(q))return {text:"I don't have that detail in Sri's portfolio. You can ask him directly if you need it.",links:[{label:'Contact Sri',href:`mailto:${portfolio.email}`}],topicId:context.topicId||null};
  let matches=searchKnowledge(question);
  const explicit=matches[0]&&!['skills','about','interests'].includes(matches[0].id)&&matches[0].aliases.some(a=>canonicalQuery(a).length>=2&&(` ${q} `).includes(` ${canonicalQuery(a)} `));
  const contextual=/\b(it|its|this|that|more|stack|technology|technologies|features|next|another|previous|back|live|price|cost|pricing|languages|yes|continue|details)\b/.test(q);
  let record=isPhoto&&selected?.entityId?knowledgeRecords.find(r=>r.id===selected.entityId):!explicit&&contextual?knowledgeRecords.find(r=>r.id===context.topicId):null;
  record ||= matches[0];
  const subject=q.match(/^(?:(?:ok|okay|please) )*(?:tell(?: me)? about|explain|describe) (?:the )?(.+)$/)?.[1];
  if(subject&&(!record||record.id==='about'&&!/\b(sri|him|his|he|background|developer|owner|portfolio|yourself)\b/.test(subject)))return {text:'Which subject do you mean? Please give its name or describe what it does.',links:[],topicId:context.topicId||null,needsClarification:true};
  if(!record&&q.split(' ').length<=3)return {text:'I didn’t catch that. Did you mean Sri’s projects, skills, background, or one of these pictures?',links:[],topicId:context.topicId||null};
  if(!record) return {text:"I don't have that detail in Sri's portfolio yet. Ask about his projects, experience, skills, certificates or interests, or contact him directly.",links:[{label:'Contact Sri',href:`mailto:${portfolio.email}`}],topicId:context.topicId||null};
  let mediaId=record.mediaIds?.[0]||null;
  if(/\b(next|another|previous)\b/.test(q)&&record.mediaIds?.length) {const current=record.mediaIds.indexOf(context.mediaId);mediaId=record.mediaIds[(Math.max(0,current)+(/previous/.test(q)?-1:1)+record.mediaIds.length)%record.mediaIds.length];}
  const matchingMedia=record.mediaIds?.map(getMedia).find(m=>m&&normalize(m.title+' '+m.description).includes(q.replace(/^(show|explain|tell me about) /,'')));
  mediaId=matchingMedia?.id||mediaId;
  let text=record.summary||record.text;
  if(/\b(stack|technology|technologies|built with|frameworks?|tools|languages)\b/.test(q)&&record.technologies) text=`${record.title} uses ${record.technologies.join(', ')}.`;
  else if(/\b(features|can it|does it do|how it works|more|details)\b/.test(q)&&record.features) text=`${record.title} includes ${record.features.map(f=>f.title.toLowerCase()).join(', ')}.\n\n${record.features.slice(0,3).map(f=>f.description).join(' ')}`;
  else if(/\b(price|pricing|cost|subscription|gst compliant|tax compliant)\b/.test(q)) text=`I don't have verified pricing or compliance details for ${record.title}. Sri can share the current product terms directly.`;
  else if(/\b(live|ready|launch|status|available|merchant|payment gateway|razorpay|cashfree|paytm)\b/.test(q)&&record.boundaries) text=`${record.title}: ${record.status}. ${record.boundaries.slice(0,2).join(' ')}`;
  else if(isPhoto&&selected) text=selected.description;
  return {text,links:record.links||[],topicId:record.id,mediaId};
}
export function publicKnowledge() {return knowledgeRecords.map(({id,title,text,links,mediaIds,boundaries,count})=>({id,title,text,links,mediaIds,boundaries,count}));}
