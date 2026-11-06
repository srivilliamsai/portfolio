import {projects} from '../data/projects.js';
import {certificates} from '../data/certificates.js';
import {achievements} from '../data/achievements.js';
import {contributions} from '../data/contributions.js';
import {technicalSkills} from '../data/technicalSkills.js';
import {interests} from '../data/assistantContent.js';
import {assistantProfile,backgroundExperience,backgroundProjects} from '../data/assistantProfile.js';
import {experience} from '../data/experience.js';
import {credlyCredentials} from '../data/credlyCredentials.js';
import {programmingLanguages} from './assistantConversation.js';
import {canonicalQuery,resolveProjectId} from './assistantQuery.js';
import {resolveAchievementId} from './assistantAchievements.js';

export function requestedAnswerFormat(question) {
  const q=canonicalQuery(question);
  if(/\b(names?|titles?)\b/.test(q)&&/\b(only|just|without (?:an? )?(?:explanation|descriptions?|details)|no (?:explanation|descriptions?|details))\b/.test(q)||/\bname them\b/.test(q))return 'names-only';
  if(/\b(?:count|number|total) only\b|\b(?:only|just) (?:give |tell |show )?(?:me )?(?:the )?(?:count|number|total)\b/.test(q))return 'count-only';
  return null;
}
function explicitScope(question,context) {
  const q=canonicalQuery(question),projectId=resolveProjectId(question),achievementId=resolveAchievementId(question,context);
  if(/\byour (?:full )?name\b/.test(q))return 'assistant';
  if(!projectId&&!achievementId&&/\b(his|sri s|villiam s) (?:full )?name\b|\bfull name\b/.test(q)&&!/\b(projects|certificates|contributions)\b/.test(q))return 'owner';
  if(/\b(spoken|human|mother tongue)\b/.test(q)&&/\blanguages\b/.test(q))return 'spoken-languages';
  if(/\b(languages|technologies|technology|stack|tools|frameworks|built with)\b/.test(q))return achievementId?'achievement-technologies':projectId||projects.some(project=>project.id===context.topicId)&&/\b(it|its|this|that)\b/.test(q)?'project-technologies':/\blanguages|programming|coding\b/.test(q)?'programming-languages':'skills';
  if(projectId)return 'project';
  if(/\b(other|personal|background|earlier) projects\b/.test(q))return 'background-projects';
  if(/\b(projects|products|case studies)\b/.test(q)&&!resolveAchievementId(question,context))return 'projects';
  if(/\b(credly|badges)\b/.test(q))return 'credly';
  if(/\b(certificates|certifications|credentials)\b/.test(q))return 'certificates';
  if(/\b(awards|achievements)\b/.test(q)&&!resolveAchievementId(question,context))return /\bawards\b/.test(q)?'awards':'achievements';
  if(resolveAchievementId(question,context))return 'achievement';
  if(/\b(open source|contributions|workday)\b/.test(q))return 'contributions';
  if(/\b(skills)\b/.test(q))return 'skills';
  if(/\b(experience|internship|internships|employers|companies)\b/.test(q))return 'experience';
  if(/\b(school|college|university|education|degree|mtech|btech)\b/.test(q))return 'education';
  if(/\b(hobbies|interests|outside work)\b/.test(q))return 'interests';
  return null;
}
function topicScope(value) {
  const topic=value||'';
  if(projects.some(project=>project.id===topic))return 'project';
  if(achievements.some(item=>item.slug===topic))return 'achievement';
  if(topic.startsWith('cert:'))return 'certificates';
  if(topic.startsWith('contribution:'))return 'contributions';
  if(topic.startsWith('background:'))return 'background-projects';
  if(/^(?:profile:(?:school|undergraduate|postgraduate)|education)$/.test(topic))return 'education';
  return ['projects','achievements','certificates','contributions','skills','experience','interests','credly','programming-languages','spoken-languages','assistant'].includes(topic)?topic:null;
}
function namesFor(scope,question,topic,context) {
  const q=canonicalQuery(question),project=projects.find(project=>project.id===(resolveProjectId(question)||topic));
  if(scope==='project-technologies')return project?.technologies;
  if(scope==='achievement-technologies')return achievements.find(item=>item.slug===(resolveAchievementId(question,context)||topic))?.technologies;
  if(scope==='project')return project?[project.title]:null;
  if(scope==='projects'){
    let selected=projects;
    if(/\b(app store|released|launched|exclude unfinished|exclude in development|only completed|completed only)\b/.test(q))selected=selected.filter(item=>item.demo?.includes('apps.apple.com'));
    else if(/\bios\b/.test(q))selected=selected.filter(item=>item.technologies.includes('SwiftUI'));
    else if(/\b(java|react|swift)\b/.test(q))selected=selected.filter(item=>item.technologies.some(name=>q.includes(name.toLowerCase())));
    return selected.map(item=>item.title);
  }
  if(scope==='programming-languages')return programmingLanguages;
  if(scope==='spoken-languages')return null;
  if(scope==='skills')return technicalSkills.map(item=>item.name);
  if(scope==='certificates'){
    const named=certificates.filter(item=>topic===`cert:${item.id}`||[item.title,item.issuer].some(alias=>(` ${q} `).includes(` ${canonicalQuery(alias)} `)));
    return (named.length?named:certificates).map(item=>item.title);
  }
  if(scope==='achievement')return achievements.filter(item=>item.slug===(resolveAchievementId(question,context)||topic)).map(item=>item.cardTitle||item.title);
  if(scope==='achievements'||scope==='awards')return achievements.filter(item=>scope!=='awards'||item.category==='Hackathon winner').map(item=>item.cardTitle||item.title);
  if(scope==='contributions')return contributions.filter(item=>!topic.startsWith('contribution:')||topic===`contribution:${item.number}`).map(item=>item.title);
  if(scope==='credly')return credlyCredentials.filter(item=>item.collection==='Credly').map(item=>item.title);
  if(scope==='experience')return [...backgroundExperience,...experience].map(item=>item.organization);
  if(scope==='background-projects')return backgroundProjects.filter(item=>!topic.startsWith('background:')||topic===`background:${item.id}`).map(item=>item.title);
  if(scope==='education'){
    const profile=assistantProfile;
    if(topic==='profile:school')return [profile.school.name];
    if(topic==='profile:postgraduate')return [profile.postgraduate.institution];
    if(topic==='profile:undergraduate')return [profile.undergraduate.institution];
    return [profile.school.name,profile.undergraduate.institution,profile.postgraduate.institution];
  }
  if(scope==='interests')return interests.filter(item=>item.id!=='mongodb-event').map(item=>item.title);
  if(scope==='assistant')return ['WILL'];
  if(scope==='owner')return ['SRI VILLIAM SAI'];
  return null;
}
// Apply explicit output constraints after routing, including early-return handlers.
// Store only a bounded scope label; lists are always rebuilt from approved data.
export function formatRequestedReply(question,context,reply) {
  const format=requestedAnswerFormat(question),explicit=explicitScope(question,context);
  const prior=context.answerScope||topicScope(context.topicId);
  const scope=explicit||(format?prior:null)||topicScope(reply.topicId);
  const topic=!explicit&&format?context.topicId||reply.topicId:reply.topicId;
  const names=namesFor(scope,question,topic||'',context);
  if(!format||!names?.length||reply.needsClarification||reply.answerUnavailable||reply.endConversation)return {...reply,answerScope:reply.answerUnavailable?null:scope||null};
  return {...reply,text:format==='count-only'?String(names.length):names.join(', '),links:[],mediaId:null,clearMedia:true,topicId:topic,answerScope:scope,answerFormat:format,tour:null};
}
