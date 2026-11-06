import {achievements} from '../data/achievements.js';
import {assistantMedia} from '../data/assistantMedia.js';
import {canonicalQuery,resolveProjectId} from './assistantQuery.js';

const f1Name=/\b(f1|f 1|formula (?:1|one))\b/;
const caseWords=/\b(case stud(?:y|ies)|projects|stack|technologies|technology|tools|languages|analysis|achievements|awards|forecast|predict(?:ion|ions|or)?|championship|simulation|model|bedrock|architecture|audit|replay|validation|pipeline|retrospective|results|outcome|lessons)\b/;
const personalWords=/\b(car|driver|team|racing interest|hobby|hobbies|favourite|favorite|why.*like|why.*(?:image|picture|photo))\b/;
const f1Id='f1-race-analysis',restaurantId='restaurant-turnover-prediction';
export function resolveAchievementId(question,context={}) {
  const q=canonicalQuery(question);
  if(/\b(restaurant turnover|turnover prediction|hackathon|headphones? case study|head phone case study)\b/.test(q))return restaurantId;
  const f1=f1Name.test(q),personal=personalWords.test(q)&&!caseWords.test(q);
  if(f1&&(caseWords.test(q)||/\bwinner\b/.test(q)||!personal&&[f1Id,'achievements'].includes(context.topicId)))return f1Id;
  if(!f1&&/\b(achievements|awards)\b/.test(q))return null;
  // A new named topic always takes priority over an old case-study selection.
  if(!f1&&/\blanguages\b/.test(q)&&(!/\b(it|its|this|that)\b/.test(q)||/\b(he|his|sri|you|your|spoken|coding|programming)\b/.test(q)))return null;
  if(f1||resolveProjectId(question)||/\b(projects|products|skills|certificates|credly|contributions|workday|school|college|education|experience|messi|dhoni|naruto|mongodb|about villiam|about sri)\b/.test(q))return null;
  if([f1Id,restaurantId].includes(context.topicId)&&/^(?:(?:ok|okay|and|please|yes) )*(?:explain|tell|describe|show|what|which|how|why|more|details|results|outcome|lessons|architecture|stack|technologies|approach|replay|audit)\b/.test(q))return context.topicId;
  return null;
}
const spokenText=text=>text.replace(/\bI worked\b/g,'Villiam worked').replace(/\bI normalised\b/g,'Villiam normalised').replace(/\bI compared\b/g,'Villiam compared');
export function achievementReply(question,context={}) {
  const id=resolveAchievementId(question,context),item=achievements.find(item=>item.slug===id);
  if(!item)return null;
  const q=canonicalQuery(question),isF1=id===f1Id;
  let sectionId=null,detailLevel=0,text;
  if(isF1&&/\bwinner\b/.test(q))return {text:'The case-study retrospective reports Kimi Antonelli as the 2026 champion, secured at Mexico City. That is the outcome described by Vivek Raja P S’s retrospective.',links:[{label:'Read the case study',href:'/achievements/'+id}],topicId:id,mediaId:'achievement:f1-race-analysis:7',tour:null};
  if(isF1&&/\b(won|win|awards)\b/.test(q)&&!/(?:how|what).*work/.test(q))text='The confirmed hackathon win is for Restaurant Turnover Prediction. The F1 work is a case study of Vivek Raja P S’s published race-analysis system.';
  else if(/\b(stack|technologies|technology|tools|languages|built with)\b/.test(q))text=`${item.cardTitle} uses ${item.technologies.join(', ')}.${isF1?' These are the technologies in the published retrospective.':''}`;
  else {
    const sections=[
      ['architecture',/\b(architecture|backend|agents?|grounding|s3|app runner)\b/],
      ['corrections',/\b(correction|corrections|audit|bug|cancelled|bahrain|saudi)\b/],
      ['replay',/\b(replay|frozen clock|backtest|validation)\b/],
      ['lessons',/\b(lessons|learned|limitations|limits)\b/],
      ['outcome',/\b(results|outcome|performance|scores?|rmse|win|winner)\b/],
      ['approach',/\b(how|approach|simulation|simulations|algorithm|model|data preparation|ensemble|blend)\b/],
      ['problem',/\b(problem|july|probability|probabilities|challenge)\b/],
    ];
    sectionId=sections.find(([,pattern])=>pattern.test(q))?.[0];
    if(!sectionId&&context.topicId===id&&/\b(more|details|deeper)\b/.test(q)){
      if(context.detailLevel===3)return {text:`That covers the extra details in this ${isF1?'F1 retrospective':'hackathon case study'}. Would you like its architecture, results or limitations?`,links:[{label:'Read the case study',href:'/achievements/'+id}],topicId:id,detailLevel:3};
      detailLevel=Math.min((context.detailLevel||0)+1,3);
      sectionId=(isF1?['approach','replay','lessons']:['approach','outcome','lessons'])[detailLevel-1];
    }
    const section=item.sections.find(section=>section.id===sectionId);
    if(section)text=(isF1?'The retrospective describes: ':'')+spokenText(section.paragraphs.slice(0,2).join(' '));
    else if(isF1)text='The F1 case study explores race analysis, 4,000 championship simulations and Amazon Bedrock explanations. It examines the July forecast and a later replay of the season, based on Vivek Raja P S’s AWS Builder Center retrospective.';
    else text=spokenText(item.introduction);
  }
  const section=item.sections.find(section=>section.id===sectionId);
  const figure=section?.figures?.[0]||section?.figure;
  const media=assistantMedia.find(media=>media.entityId===id&&media.src===figure?.src)
    ||assistantMedia.find(media=>media.entityId===id&&media.id===context.mediaId)
    ||assistantMedia.find(media=>media.entityId===id&&media.id===`achievement:${id}:${isF1?1:2}`)
    ||assistantMedia.find(media=>media.entityId===id);
  return {text,links:[{label:'Read the case study',href:`/achievements/${id}`}],topicId:id,mediaId:media?.id||null,detailLevel,tour:context.topicId===id?context.tour||null:null};
}
