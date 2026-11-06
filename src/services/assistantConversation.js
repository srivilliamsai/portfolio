import {products,interests} from '../data/assistantContent.js';
import {backgroundProjects} from '../data/assistantProfile.js';
import {projects} from '../data/projects.js';
import {portfolio} from '../data/portfolio.js';
import {technicalSkills} from '../data/technicalSkills.js';
import {certificates} from '../data/certificates.js';
import {achievements} from '../data/achievements.js';
import {contributions} from '../data/contributions.js';
import {credlyCredentials,credlySnapshotDate} from '../data/credlyCredentials.js';
import {assistantMedia} from '../data/assistantMedia.js';
import {canonicalQuery,normalize,resolveProjectId} from './assistantQuery.js';

const join=items=>items.length<2?items.join(''):items.slice(0,-1).join(', ')+' and '+items.at(-1);
const quantity=n=>['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'][n]||String(n);
const mediaFor=id=>assistantMedia.find(media=>media.entityId===id&&!media.placeholder)?.id;
export const programmingLanguages=[...new Set([...technicalSkills.filter(skill=>skill.category==='Languages').map(skill=>skill.name),...projects.flatMap(project=>project.technologies).filter(name=>['Swift','Dart'].includes(name))])];
const catalog={
  projects:{title:'Projects',items:projects.map(project=>({id:project.id,title:project.title,text:products.find(item=>item.id===project.id)?`${products.find(item=>item.id===project.id).summary} Its stack includes ${join(project.technologies.slice(0,3))}. ${project.status}.`:`${project.description} ${project.contribution.replace(/^Product developer responsible for /,'Sri built ').replace(/^Product developer across /,'Sri worked across ')}`,href:project.link,mediaId:mediaFor(project.id)})),link:{label:'All projects',href:'/projects'}},
  achievements:{title:'Achievements',items:achievements.map(item=>({id:item.slug,title:item.cardTitle||item.title,text:item.slug==='restaurant-turnover-prediction'?`Sri earned hackathon winner recognition for Restaurant Turnover Prediction on ${item.dateLabel}. He worked on data preparation, model comparisons and validated ensembles.`:`${item.introduction} It draws on Vivek Raja P S’s AWS Builder Center retrospective.`,href:`/achievements/${item.slug}`,mediaId:mediaFor(item.slug)})),link:{label:'Achievements',href:'/achievements'}},
  certificates:{title:'Selected certificates',items:certificates.map(item=>({id:`cert:${item.id}`,title:item.title,text:`${item.title}, issued by ${item.issuer} on ${item.issued}.${item.note?' '+item.note:''}`,href:item.src,mediaId:`certificate:${item.id}`})),link:{label:'Certificates and Credly badges',href:'/certificates'}},
  contributions:{title:'Open-source contributions',items:contributions.map(item=>({id:`contribution:${item.number}`,title:item.title,text:`${item.title}: ${item.contribution} Merged into ${item.repository} on ${item.mergedAt}.`,href:item.url})),link:{label:'Open-source contributions',href:'/#open-source'}}
};
const credlyBadges=credlyCredentials.filter(item=>item.collection==='Credly');
const otherCredentials=credlyCredentials.filter(item=>item.collection!=='Credly');
const credentialSummary=`The portfolio’s Credly snapshot from ${credlySnapshotDate} contains ${credlyBadges.length} Credly badges and ${otherCredentials.length} other credentials, ${credlyCredentials.length} cards in total. The other credentials retain their source’s Unverified label. The three selected certificate documents are shown separately above them.`;
const projectNames=join(catalog.projects.items.map(item=>item.title));
const languageNames=join(programmingLanguages);
const overviews={
  projects:`Sri has worked on ${quantity(projects.length)} main projects: ${projectNames}. They span roadside assistance, sustainability, weather, wallpapers, restaurant operations and freelancer invoicing.`,
  achievements:`Sri earned hackathon winner recognition for Restaurant Turnover Prediction, working on data preparation, model comparisons and validated ensembles. He also has ${quantity(contributions.length)} merged contributions to Workday’s developer catalog. His F1 case study explores race analysis and championship forecasting through a published retrospective.`,
  certificates:`There are ${quantity(certificates.length)} selected certificate documents: ${join(certificates.map(item=>item.title))}. The same page also shows his separate Credly collection.`,
  contributions:`Sri has ${quantity(contributions.length)} merged contributions to Workday’s public developer catalog: ${join(contributions.map(item=>item.title))}.`,
  'programming-languages':`Sri’s portfolio documents ${quantity(programmingLanguages.length)} programming and query languages: ${languageNames}. He uses Java for backend work and Swift for native iOS apps.`
};
export const conversationRecords=[
  {id:'credly',title:'Credly badges',aliases:['credly','badges','badge count'],text:credentialSummary,links:[{label:'Badges and credentials',href:'/certificates#credly-credentials'},{label:'Credly profile',href:portfolio.credentials}],mediaIds:[],count:credlyBadges.length},
  ...Object.entries(catalog).map(([id,collection])=>({id,title:collection.title,aliases:id==='projects'?['project','projects','products','case studies','how many projects']:id==='achievements'?['achievement','achievements','awards']:id==='certificates'?['certificate','certificates','certifications','credentials']:['open source','workday','contributions'],text:overviews[id],links:[collection.link],mediaIds:[],count:collection.items.length})),
  {id:'programming-languages',title:'Programming languages',aliases:['language','languages','programming languages','coding languages'],text:overviews['programming-languages'],links:[{label:'Skills',href:'/#skills'}],mediaIds:[],count:programmingLanguages.length}
];
function overview(id,namesOnly=false){
  const collection=catalog[id];
  const text=namesOnly?`The ${quantity(collection.items.length)} ${id==='contributions'?'contributions':id} are ${join(collection.items.map(item=>item.title))}.`:overviews[id];
  return {text,links:[collection.link],topicId:id,tour:null,clearMedia:true};
}
function tourReply(id,index) {
  const collection=catalog[id],item=collection.items[index];
  if(!item)return {text:`That’s all ${quantity(collection.items.length)} listed ${id}. Would you like to revisit one or explore Sri’s background?`,links:[collection.link],topicId:id,tour:{collection:id,index:collection.items.length-1}};
  const final=index===collection.items.length-1;
  return {text:`${index+1} of ${collection.items.length}: ${item.title}. ${item.text}${final?` That’s the last of the ${id}.`:' Say “next” when you’re ready for the next one.'}`,links:[{label:'Read more',href:item.href}],topicId:item.id,mediaId:item.mediaId||null,tour:{collection:id,index}};
}
const namedProject=q=>projects.find(project=>project.id===resolveProjectId(q));

export function conversationReply(question,context={}) {
  const q=canonicalQuery(question),tour=context.tour&&catalog[context.tour.collection]?context.tour:null;
  const collectionId=tour?.collection||(catalog[context.topicId]?context.topicId:null);
  const names=/\b(names?|spell|list them|which ones|what are they|name them)\b/.test(q);
  const next=/^(?:(?:ok|okay|yes|yeah|and|please|then|go on) )*(?:next|continue|go on|move on|another)(?: one| projects)?(?: please)?$/.test(q);
  const previous=/^(?:(?:ok|okay|yes|and|please) )*(?:previous|back)(?: one| projects)?$/.test(q);
  const yes=/^(yes|yeah|sure|okay|ok|go ahead|yes please)$/.test(q);
  const oneByOne=/\b(one by one|each one|walk me through|start (?:with )?(?:the )?first|first projects)\b/.test(q);
  const mentionsProjects=/\b(projects|products|case studies|portfolio work)\b/.test(q);
  const imageNavigation=/\b(image|photo|picture|screen)\b/.test(q);
  const project=namedProject(q);
  const namedCertificate=certificates.some(item=>[item.title,item.issuer].some(alias=>(` ${q} `).includes(` ${canonicalQuery(alias)} `)));
  const language=/\blanguages\b/.test(q)||/\b(programming|coding)\b/.test(q)&&/\b(know|use|many)\b/.test(q);
  const languageProject=project||(/\b(it|its|this|that)\b/.test(q)?projects.find(item=>item.id===context.topicId):null);
  if(language&&languageProject)return {text:`${languageProject.title} uses ${join(languageProject.technologies)}.`,links:[{label:'Read the case study',href:languageProject.link}],topicId:languageProject.id,tour:context.topicId===languageProject.id?context.tour||null:null};
  if(language||context.topicId==='programming-languages'&&names){
    if(/\b(spoken|human|speak|tamil|hindi|english|mother tongue)\b/.test(q)&&/\byou\b/.test(q))return {text:'This version of WILL is set up for English questions and voice recognition. Sri’s spoken languages are not listed in the portfolio.',links:[],topicId:'assistant',tour:null};
    if(/\b(spoken|human|speak|tamil|hindi|english|mother tongue)\b/.test(q))return {text:'Sri’s spoken languages are not listed in the portfolio. If you mean programming languages, I can walk you through those.',links:[],topicId:'spoken-languages',tour:null};
    const ambiguous=/\byou\b/.test(q)&&!/\b(programming|coding|computer|code)\b/.test(q);
    return {text:(ambiguous?'If you mean Sri’s coding languages, ':'')+overviews['programming-languages'],links:[{label:'Explore skills',href:'/#skills'}],topicId:'programming-languages',tour:null};
  }
  if(/\b(tamil|hindi|english)\b/.test(q)&&/\b(speak|know|languages)\b/.test(q)&&/\byou\b/.test(q))return {text:'This version of WILL is set up for English questions and voice recognition. Sri’s spoken languages are not listed in the portfolio.',links:[],topicId:'assistant',tour:null};
  if(/\b(tamil|hindi|english)\b/.test(q)&&/\b(speak|know|languages)\b/.test(q))return {text:'I don’t have Sri’s spoken-language details in the portfolio. His documented coding languages are '+languageNames+'.',links:[],topicId:'spoken-languages',tour:null};
  if(!project&&/\b(right now|currently|working on|building now|building these days)\b/.test(q))return {text:[...products.map(product=>product.summary),backgroundProjects.find(project=>project.id==='zidioconnect').summary].join(' '),links:products.map(product=>({label:product.name,href:`/${product.id}`})),topicId:'projects',tour:null,clearMedia:true};
  if(/\bskills\b/.test(q)&&/\b(how many|count|number|total)\b/.test(q))return {text:`The skills grid lists ${quantity(technicalSkills.length)} tools and technologies. His core stack includes Java, Spring Boot, React and SwiftUI; the projects also document Swift and Dart.`,links:[{label:'Explore skills',href:'/#skills'}],topicId:'skills',tour:null};
  if(/\b(childhood|child|baby)\b/.test(q)&&/\b(photo|picture|image)\b/.test(q))return {text:'There isn’t a childhood photo in Sri’s gallery. I can show you his outdoor portrait instead.',links:[],topicId:'about',mediaId:'personal:outdoor-portrait',tour:null};
  if(/\b(current|recent|his|sri)\b/.test(q)&&/\b(photos|pictures|portraits)\b/.test(q))return {text:'Here’s Sri’s outdoor portrait. There’s also a mirror portrait in the gallery on the right.',links:[],topicId:'about',mediaId:'personal:outdoor-portrait',tour:null};
  if(/\bbatman\b/.test(q))return {text:'That’s a crocheted Batman collectible. I don’t have a story about a favourite superhero from Sri yet.',links:[],topicId:'interests',mediaId:'personal:batman',tour:null};
  if(mentionsProjects&&!project&&(next||previous)&&collectionId==='projects')return tourReply('projects',Math.max(0,tour?tour.index+(previous?-1:1):0));
  if(mentionsProjects&&!project&&/\b(app store|ios|java|react|swift)\b/.test(q)){
    const selected=projects.filter(item=>/\bapp store\b/.test(q)?item.demo?.includes('apps.apple.com'):/\bios\b/.test(q)?item.technologies.some(name=>['Swift','SwiftUI'].includes(name)):item.technologies.some(name=>q.includes(name.toLowerCase())));
    if(selected.length)return {text:join(selected.map(item=>item.title))+` ${selected.length===1?'is':'are'} listed for that platform or technology. `+selected.map(item=>item.description).join(' '),links:selected.map(item=>({label:item.title,href:item.link})),topicId:'projects',tour:null,clearMedia:true};
  }
  if(mentionsProjects&&!project){
    if(/\b(who|whose)\b/.test(q))return {text:'Sri Villiam Sai is the developer behind these projects. Each case study describes his contribution and the project’s scope.',links:[catalog.projects.link],topicId:'projects',tour:null};
    if(/\b(completed|finished|released|launched)\b/.test(q))return {...overview('projects'),text:overviews.projects+' Some are still in development; the count describes listed work, not six released products.'};
    const ordinal=q.match(/\b(first|second|third|fourth|fifth|sixth|last)\b/);
    if(ordinal){const index=ordinal[1]==='last'?projects.length-1:['first','second','third','fourth','fifth','sixth'].indexOf(ordinal[1]);return tourReply('projects',index);}
    if(oneByOne)return tourReply('projects',0);
    if(/\b(explain|describe|detail)\b/.test(q)&&/\b(all|every)\b/.test(q))return {text:catalog.projects.items.map((item,index)=>`${index+1}. ${item.title}: ${projects[index].description}`).join('\n\n'),links:[catalog.projects.link],topicId:'projects',tour:null,clearMedia:true};
    const specific=/\b(tell|explain|describe|show|about)\b/.test(q)&&!/\b(how many|count|total|all|every|completed|finished|released|launched)\b/.test(q);
    const remainder=q.replace(/\b(tell|me|explain|describe|show|about|the|a|an|his|he|sri|please|okay|ok|projects|products|case|studies|some|any|of|and|what|are|is|does|did|has|have|do|names|name|titles|title|only|just|list|them|their|without|explanation|descriptions|details)\b/g,'').trim();
    if(specific&&remainder)return {text:'I couldn’t match that project name. Could you spell it or describe what it does?',needsClarification:true,links:[],topicId:'projects',tour:null,clearMedia:true};
    return overview('projects',names);
  }
  if(/\b(credly|badges)\b/.test(q)||context.topicId==='credly'&&/\b(how many|count|total)\b/.test(q))return {text:credentialSummary,links:[{label:'Badges and credentials',href:'/certificates#credly-credentials'},{label:'Credly profile',href:portfolio.credentials}],topicId:'credly',tour:null,clearMedia:true};
  if(/\b(hobbies|outside work|free time)\b/.test(q)||/\bwhat (does|do) (he|sri) (like|enjoy)\b/.test(q))return {text:'Sri enjoys '+join(interests.filter(item=>item.id!=='mongodb-event').map(item=>item.title))+'. He enjoys watching football and playing on weekends, and has also attended MongoDB.local.',links:[],topicId:'interests',tour:null};
  if(/\b(achievements|awards)\b/.test(q)&&!/\b(restaurant|turnover|f1|formula|championship)\b/.test(q)){
    if(/\b(how many|count|total)\b/.test(q))return {text:(/\bawards\b/.test(q)?'There is one confirmed award: the Restaurant Turnover Prediction hackathon win. ':`There are ${quantity(achievements.length)} featured achievement entries: ${join(achievements.map(item=>item.cardTitle||item.title))}. `)+`His confirmed recognition includes a hackathon win for Restaurant Turnover Prediction and ${quantity(contributions.length)} merged Workday contributions. The F1 entry is an attributed case study.`,links:[catalog.achievements.link],topicId:'achievements',tour:null,clearMedia:true};
    return oneByOne?tourReply('achievements',0):overview('achievements');
  }
  if(/\b(certificates|credentials|certifications)\b/.test(q)&&!namedCertificate&&!/\b(google|mongodb|anthropic|claude|oracle|java|snowflake|github|infosys)\b/.test(q))return oneByOne?tourReply('certificates',0):overview('certificates',names);
  if(/\b(open source|contributions|workday)\b/.test(q)&&!/\b(accessibility|kudos|milestone|leave|skills)\b/.test(q))return oneByOne?tourReply('contributions',0):overview('contributions',names);
  if(collectionId&&!project&&!imageNavigation){
    if(names)return overview(collectionId,true);
    if(/\b(how many|count|total|how much)\b/.test(q))return overview(collectionId);
    if(oneByOne)return tourReply(collectionId,0);
    if(next||previous||yes){const index=tour?tour.index+(previous?-1:1):0;return tourReply(collectionId,Math.max(0,index));}
    if(/^(repeat|again|say that again)$/.test(q)&&tour)return tourReply(collectionId,tour.index);
    const ordinal=q.match(/\b(first|second|third|fourth|fifth|sixth|last|number [1-9]|[1-9])\b/);
    if(ordinal&&q.split(' ').length<9){const key=ordinal[1],index=key==='last'?catalog[collectionId].items.length-1:['first','second','third','fourth','fifth','sixth'].includes(key)?['first','second','third','fourth','fifth','sixth'].indexOf(key):Number(key.replace('number ',''))-1;return tourReply(collectionId,index);}
  }
  if(!imageNavigation&&(next||previous)&&projects.some(item=>item.id===context.topicId))return tourReply('projects',projects.findIndex(item=>item.id===context.topicId)+(previous?-1:1));
  if(yes||next)return {text:'Would you like a project walkthrough, his skills, or his background?',links:[],topicId:context.topicId||null};
  if(/\b(songs?|music|anime|childhood|favourite movie|favorite movie)\b/.test(q))return {text:'I don’t have that personal detail in Sri’s portfolio. I can tell you about his football, cricket, basketball and Formula 1 interests, or his work.',links:[],topicId:'interests',tour:null};
  return null;
}
