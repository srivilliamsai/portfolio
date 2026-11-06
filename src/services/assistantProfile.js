import {assistantProfile as profile,backgroundProjects,backgroundExperience} from '../data/assistantProfile.js';
import {experience} from '../data/experience.js';
import {canonicalQuery,resolveProjectId} from './assistantQuery.js';

const aboutLink={label:'About Sri',href:'/#about-me'};
const school=profile.school,ug=profile.undergraduate,pg=profile.postgraduate;
const schoolAnswer=`Sri attended ${school.name} in ${school.town} and completed school in ${school.completed}.`;
const undergraduateAnswer=`Sri completed his B.Tech. in Information Technology at ${ug.institution} from ${ug.years}, graduating in ${ug.graduated}.`;
const postgraduateAnswer=`Sri is pursuing ${pg.qualification} at ${pg.institution} for ${pg.period}, with completion expected in ${pg.expectedGraduation}.`;
export const educationAnswer=`Sri completed school in ${school.town} in ${school.completed}, then B.Tech. in Information Technology at ${ug.institution} from ${ug.years}. He is now pursuing M.Tech in Artificial Intelligence at ${pg.institution} for ${pg.period}, with completion expected in ${pg.expectedGraduation}.`;
const allExperience=[...backgroundExperience,...experience];
const experienceAnswer=allExperience.map(item=>`${item.role} at ${item.organization} (${item.period})`).join('; ')+'.';
const record=(id,title,aliases,text,boundaries=[])=>({id:`profile:${id}`,title,aliases,text,summary:text,links:[aboutLink],mediaIds:[],boundaries});
export const profileRecords=[
  record('birthplace','Birthplace',['birthplace','birth place','born','where is sri from','where is he from'],`Sri was born in ${profile.birthplace}.`,['Birthplace does not establish current residence, where he grew up, or the location of a gallery photo. His date of birth is not supplied.']),
  record('residence','Current residence',['current location','currently located','sri location','where does he live','where is he based'],profile.currentResidence?`Sri currently lives in ${profile.currentResidence}.`:'Sri’s current city of residence is not specified in the portfolio.', ['Birthplace, college and internship locations do not establish current residence.']),
  record('family','Family information',['brother','brothers','sister','sisters','siblings','family','parents'],'Sri has not supplied information about his family or siblings.'),
  record('school','School',['school','schooling','london krishnamoorthi','orathanadu','higher secondary'],schoolAnswer,['School start year is not supplied.']),
  record('undergraduate','Undergraduate education',['btech','b tech','bachelor','undergraduate','valliammai','srm valliammai'],undergraduateAnswer),
  record('postgraduate','Postgraduate education',['mtech','m tech','masters','master','postgraduate','srmist','srm institute of science and technology'],postgraduateAnswer,['2028 is an expected completion year, not a completed qualification.']),
  record('early-experience','Global Techno Solution internship',['global techno solution','global techno','first internship','2023 internship'],`${backgroundExperience[0].role} at ${backgroundExperience[0].organization}, ${backgroundExperience[0].period}, ${backgroundExperience[0].location}. ${backgroundExperience[0].summary}`),
  record('learning','Learning approach',['learning approach','learning style','learn by building','learning journey','learn technology'],profile.learning),
  record('career','Career direction',['career goals','career objective','career direction','aspirations','software engineer','backend developer'],profile.career),
  record('foundations','Programming foundations',['c and c++','c++','cplusplus','angular experience','python experience','programming foundations'],profile.foundations),
  record('practice','Coding practice',['hackerrank','geeksforgeeks','coding practice','java badge','java problems'],profile.codingPractice),
  record('personal-projects','Additional personal projects',['personal projects','earlier projects','other projects','zidioconnect sren vill llm'],backgroundProjects.map(project=>project.summary).join(' '),['These background projects are separate from the six featured case-study entries. They do not establish a complete lifetime project count.']),
  ...backgroundProjects.map(project=>({id:`background:${project.id}`,title:project.title,aliases:project.aliases,text:`${project.summary} ${project.details} ${project.stack} ${project.status}`,summary:project.summary,links:[],mediaIds:[],boundaries:[project.status]})),
];
const response=(id,text)=>({text,links:id.startsWith('background:')?[]:[aboutLink],topicId:id,tour:null,clearMedia:true});
const projectFor=q=>backgroundProjects.find(project=>project.aliases.some(alias=>(` ${q} `).includes(` ${canonicalQuery(alias)} `)));
const schoolId='profile:school',ugId='profile:undergraduate',pgId='profile:postgraduate';

export function profileReply(question,context={}) {
  const q=canonicalQuery(question),topic=context.topicId||'';
  const repeat=/^(tell me more|explain more|more|more details|details|explain|repeat|again|say that again)$/.test(q);
  const when=/\b(when|years?|batch|period|start|started|finish|finished|completed|graduate|graduated|graduation)\b/.test(q);
  const educationFollow=/^(?:(?:and|okay|ok) )?(?:when|where|which (?:one|college|university|institution)|what (?:name|years?|period)|how long|is (?:it|he|that)|has he|did he)(?:\b.*)?$/.test(q)&&!/\b(work|job|internship|projects|languages|photo|picture|image|company|employer)\b/.test(q);
  const named=projectFor(q);
  const explicitShowcase=Boolean(resolveProjectId(question));
  const locationQuestion=!explicitShowcase&&!named&&!/\b(photos?|pictures?|images?|screen|school|college|university|internship|company|projects|event|mongodb|born|birthplace)\b/.test(q)&&(/\b(location|located|residence|resides|whereabouts)\b/.test(q)||/\bwhere (?:does|is) (?:he|sri) (?:currently )?(?:live|living|based|stay|staying)\b/.test(q)||/^(?:where is (?:he|sri)(?: now| currently)?|where (?:is|does) (?:he|sri) (?:live|stay) now)$/.test(q));
  if(locationQuestion)return {...response('profile:residence',profile.currentResidence?`Sri currently lives in ${profile.currentResidence}.`:'Sri’s current city of residence is not specified in the portfolio.'),links:[],answerUnavailable:!profile.currentResidence};
  if(!explicitShowcase&&!named&&/\b(brothers?|sisters?|siblings?|family|parents?|father|mother)\b/.test(q))return {...response('profile:family',/\b(brothers?|sisters?|siblings?)\b/.test(q)?'I don’t have information about Sri’s siblings in the portfolio.':'Sri has not supplied information about his family in the portfolio.'),links:[],answerUnavailable:true};
  const project=named||(!explicitShowcase&&!/\b(photo|picture|image|screen)\b/.test(q)&&/^background:/.test(topic)&&(/\b(it|its|this|that)\b/.test(q)||/^(?:what|which) (?:model|architecture)\b/.test(q)||repeat)?backgroundProjects.find(item=>`background:${item.id}`===topic):null);
  if(project){
    const text=/\b(status|complete|completed|finished|released|live|launch|available|ready)\b/.test(q)?project.status:/\b(stack|technologies|technology|languages|framework|built with|model|architecture|trained)\b/.test(q)?project.stack:repeat||/\b(features|details|modules|how.*work|what.*do)\b/.test(q)?`${project.summary} ${project.details}`:`${project.summary} ${project.status}`;
    return response(`background:${project.id}`,text);
  }
  if(/\b(born|birthplace|birth place)\b/.test(q)||/\bwhere (?:is|was|does) (?:he|sri|sri villiam sai) (?:come )?from\b/.test(q))return response('profile:birthplace',when?'I have Sri’s birthplace, Thanjavur, India, but not his date or year of birth.':`Sri was born in ${profile.birthplace}.`);
  const schoolQuestion=/\b(school|schooling|schooled|london krishnamoorthi|higher secondary|orathanadu)\b/.test(q);
  const postgraduateQuestion=/\b(mtech|m tech|masters|master|postgraduate|post graduate|srmist|srm institute of science and technology)\b/.test(q);
  const undergraduateQuestion=/\b(btech|b tech|bachelor|bachelors|undergraduate|under graduate|valliammai)\b/.test(q);
  if(schoolQuestion){
    if(/\b(start|started|join|joined|begin)\b/.test(q))return response(schoolId,`I have his school completion year, ${school.completed}, but not the year he joined.`);
    return response(schoolId,schoolAnswer);
  }
  if(postgraduateQuestion)return response(pgId,postgraduateAnswer);
  if(undergraduateQuestion){
    if(/\b(cgpa|gpa|grade|marks|score)\b/.test(q))return response(ugId,`Sri’s shared background reports a B.Tech CGPA of ${ug.cgpa}.`);
    return response(ugId,undergraduateAnswer);
  }
  if(/\b(cgpa|gpa)\b/.test(q))return response(ugId,`Sri’s shared background reports a B.Tech CGPA of ${ug.cgpa}.`);
  if([schoolId,ugId,pgId].includes(topic)&&(repeat||educationFollow)){
    if(topic===schoolId)return response(schoolId,/\b(start|started|join|joined|begin)\b/.test(q)?`I have his school completion year, ${school.completed}, but not the year he joined.`:when?`Sri completed school in ${school.completed}.`:/\bwhere\b/.test(q)?`His school is in ${school.town}.`:schoolAnswer);
    if(topic===ugId)return response(ugId,when?`Sri studied B.Tech from ${ug.years} and graduated in ${ug.graduated}.`:undergraduateAnswer);
    return response(pgId,when?`He started in ${pg.startYear} and expects to complete his M.Tech in ${pg.expectedGraduation}.`:postgraduateAnswer);
  }
  if(/\b(studying|pursuing)\b/.test(q)||/\b(current|currently|now)\b/.test(q)&&/\b(study|course)\b/.test(q))return response(pgId,postgraduateAnswer);
  if(topic==='profile:birthplace'&&(repeat||educationFollow))return response('profile:birthplace',when?'I have Sri’s birthplace, Thanjavur, India, but not his date or year of birth.':`Sri was born in ${profile.birthplace}.`);
  if(/\b(education|qualifications?|academic background|educational background|college|university|degree)\b/.test(q)||/\bwhere.*(?:study|studying|studied)\b/.test(q)){
    if(/\b(now|currently|pursuing|studying|current)\b/.test(q))return response(pgId,postgraduateAnswer);
    if(/\b(college|university)\b/.test(q)&&!/\b(all|journey|education|both)\b/.test(q))return response(ugId,undergraduateAnswer);
    return response('education',educationAnswer);
  }
  if(/\b(personal projects|earlier projects|other projects|background projects)\b/.test(q))return response('profile:personal-projects',`Alongside the six showcased projects, Sri has shared background on ZidioConnect, SREN and VILL LLM. ZidioConnect is in development; SREN and VILL LLM are personal projects whose release status has not been specified.`);
  if(/\b(global techno|first internship|2023 internship)\b/.test(q)||topic==='profile:early-experience'&&repeat)return response('profile:early-experience',profileRecords.find(item=>item.id==='profile:early-experience').text);
  if(/\b(internships?|work experience|work history|professional experience)\b/.test(q))return response('experience',`Sri’s background includes ${experienceAnswer}`);
  if(/\b(hackerrank|geeksforgeeks|coding practice|java badge|java problems)\b/.test(q)||topic==='profile:practice'&&repeat)return response('profile:practice',profile.codingPractice);
  if(/\b(learning (?:approach|style|journey)|learn by building|how.*learn|why.*(?:java|software|programming))\b/.test(q)||topic==='profile:learning'&&repeat)return response('profile:learning',profile.learning);
  if(/\b(career (?:goals?|objective|direction)|aspirations?|long term goals?|future goals?|want.*become)\b/.test(q)||topic==='profile:career'&&repeat)return response('profile:career',profile.career);
  if(/\b(c and c|cplusplus|c plus plus|angular experience|python experience)\b/.test(q)||/c\+\+/.test(String(question).toLowerCase())||topic==='profile:foundations'&&repeat)return response('profile:foundations',profile.foundations);
  if(/^(?:tell me about |what is |describe )?(?:his |sri s )?(?:background|journey|story)$/.test(q))return response('about',`Sri was born in ${profile.birthplace} and completed school in ${school.town} in ${school.completed}. After B.Tech. in Information Technology from ${ug.years}, he developed his full-stack skills through projects and internships; he is now pursuing M.Tech in Artificial Intelligence at ${pg.institution} for ${pg.period}.`);
  const overview=/^(?:(?:okay|ok|please) )?(?:about|(?:tell me|explain|describe|introduce)(?: more)?(?: about| me about)?)(?: (?:she|he|him|her|sri|sri villiam sai|his background))?$/.test(q);
  if(overview&&(!repeat||!topic||topic==='about')||topic==='about'&&repeat){
    if(repeat&&context.detailLevel===3)return {...response('about','That covers the background details Villiam has shared. Would you like to explore his education, experience or a project?'),detailLevel:3};
    const detail=overview&&!repeat?0:Math.min((context.detailLevel||0)+1,3);
    const sections=[
      'Sri Villiam Sai is a product developer who builds web, iOS and SaaS products, from frontend interfaces to backend services. He learns by building practical tools, including DineDesk for restaurants and Invoice Picker for freelancers.',
      `He was born in ${profile.birthplace} and completed school at ${school.name} in ${school.town} in ${school.completed}. He studied B.Tech at ${ug.institution} (${ug.years}) and is pursuing M.Tech in AI at ${pg.institution} (${pg.period}, expected completion ${pg.expectedGraduation}).`,
      `His experience includes ${experienceAnswer} He applies that learning to his products; DineDesk is still in pre-production, and ZidioConnect is in development.`,
      'Outside work, he likes Lionel Messi, enjoys watching football and playing on weekends, and is a Naruto fan. He has also attended MongoDB.local. Would you like to explore a project, his education, or one of those interests?'
    ];
    return {...response('about',sections[detail]),detailLevel:detail};
  }
  return null;
}
