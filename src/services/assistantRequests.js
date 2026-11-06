import {projects} from '../data/projects.js';
import {canonicalQuery,resolveProjectId} from './assistantQuery.js';
export function isFarewell(question){const q=canonicalQuery(question);return /^(?:(?:ok|okay|well|alright|thanks|thank you|will) )*(?:bye(?: bye)?|goodbye|good bye|see you(?: later)?|that s all|that is all)(?: will| thanks| thank you)?$/.test(q)||/^(?:ok|okay) (?:buy|by)$/.test(q);}
export function requestReply(question,context={}){
  const q=canonicalQuery(question);
  if(/^(?:(?:ok|okay|please) )*earphones?$/.test(q))return {text:context.clarificationId==='earphone'?'Say “F1” for the racing-car picture, or “hackathon” for the case study. If you meant headphones, that detail isn’t in the portfolio.':'Did you mean Formula 1, the hackathon case study, or headphones?',links:[],topicId:context.topicId||null,needsClarification:true,clarificationId:'earphone'};
  if(isFarewell(question))return {text:'Thanks for stopping by! Take care.',links:[],topicId:'assistant',tour:null,clearMedia:true,endConversation:true};
  if(/\b(left|right) (?:hand )?side\b/.test(q)&&/\b(images?|photos?|pictures?|imagine|gallery|screenshots?)\b/.test(q))return {text:'The left gallery shows project screenshots. The right gallery holds Villiam’s portraits and interest pictures. Which picture would you like me to explain?',links:[],topicId:'gallery',tour:null,clearMedia:true,needsClarification:true};
  if(/\b(how many|how much|number|count|total)\b/.test(q)&&/\b(downloads?|installs?|users?|revenue|earnings|ratings?)\b/.test(q)){
    const project=projects.find(item=>item.id===(resolveProjectId(question)||context.topicId));
    const metric=/\b(downloads?|installs?)\b/.test(q)?'download or install count':/\busers?\b/.test(q)?'user count':/\bratings?\b/.test(q)?'rating figures':'revenue figures';
    return {text:project?`I don’t have a verified ${metric} for ${project.title}.`:`I don’t have verified ${metric} in the portfolio. Which project do you mean?`,links:project?[{label:`${project.title} case study`,href:project.link}]:[],topicId:project?.id||context.topicId||null,answerUnavailable:true,...(!project?{needsClarification:true}:{})};
  }
  return null;
}
