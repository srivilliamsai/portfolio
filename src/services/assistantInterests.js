import {assistantMedia} from '../data/assistantMedia.js';
import {canonicalQuery,resolveProjectId} from './assistantQuery.js';

// Resolve names before pronouns so an old selection cannot override a new request.
// These aliases describe the owner's approved pictures, not inferred biography.
const targets=[
  {id:'personal:lionel-messi',pattern:/\b(messi|lionel|football)\b/,why:'Sri likes Lionel Messi, and football is part of his weekends: he enjoys watching it and playing. That’s the connection behind this picture.'},
  {id:'personal:cricket',pattern:/\b(dhoni|ms dhoni|mahi|cricket)\b/,why:'The Dhoni picture represents Sri’s interest in cricket. He hasn’t shared a more specific story behind choosing it.'},
  {id:'personal:formula-one',pattern:/\b(f1|f 1|formula (?:1|one))\b/,why:'Sri enjoys watching the Formula 1 series. The red racing-car picture represents that interest.'},
  {id:'personal:developer-workspace',pattern:/\b(laptop|macbook|workspace|coding setup|developer setup)\b/,why:'That laptop picture represents Sri’s work as a developer: building interfaces, backend services and the connections between them.'},
  {id:'personal:mongodb-coffee',pattern:/\b(mongodb(?: local)?|mongo db|mango (?:d ?b|dp)|coffee|event cup)\b/,why:'Sri already attended MongoDB.local. The cup and event sign are from the event picture he shared; he also enjoys exploring new technologies.'},
  {id:'personal:naruto',pattern:/\b(naruto|anime)\b/,why:'Sri is a Naruto fan, so this artwork represents his anime interest alongside his sports and software projects.'},
  {id:'personal:basketball',pattern:/\b(michael jordan|jordan|basketball)\b/,why:'The Michael Jordan picture represents Sri’s interest in basketball. He hasn’t shared a more specific personal story about it.'},
];
const mediaFor=id=>assistantMedia.find(media=>media.id===id&&media.group==='personal'&&!media.placeholder);
const portraitIds=['personal:outdoor-portrait','personal:mirror-portrait'];
const photoWords=/\b(images?|photos?|pictures?|portraits?|screen|one)\b/;
const photoFollow=/^(?:(?:okay|ok|and|yes|please) )*(?:why(?: (?:is that|does he|he had|he has|should he had|did he have|does he have))?|tell me more|explain more|more|what about (?:it|this|that))$/;
const nextPhoto=/^(?:(?:okay|ok|and|yes|please|show|show me|the) )*(next|previous|another)(?: (?:image|photo|picture|one))?(?: please)?$/;
const unrelated=/\b(projects|products|pitstop|pit stop|carbon footprint|wyndra|glassora|dinedesk|dine desk|invoice picker|zidioconnect|sren|vill llm|certificates|certifications|credentials|badges|exam|certified|skills|languages|stack|technologies|programming|salary|net worth|age|birthday|birth date|phone number|born|birthplace|school|college|university|degree|mtech|btech|internship|workday|championship|forecast|bedrock|race analysis)\b/;

function answer(media,q,{named=false}={}) {
  const target=targets.find(item=>item.id===media.id);
  const location=/\b(where|location|which city|what city|place|taken at)\b/.test(q);
  const date=/\b(when|date|what year|which year|what day)\b/.test(q);
  let text=media.reply;
  if(location)text=media.id==='personal:mongodb-coffee'?'Sri has attended MongoDB.local, but I don’t have the city or venue for that event.':'I don’t have the location for this photo.';
  else if(date)text=media.id==='personal:mongodb-coffee'?'He has already attended MongoDB.local, but I don’t have the event date.':'I don’t have a date for this photo.';
  else if(/\b(favou?rite|best|reason|why)\b/.test(q)) {
    if(/\b(favou?rite|best)\b/.test(q)&&media.id==='personal:naruto'&&/\b(character|arc|episode)\b/.test(q))text='Sri is a Naruto fan, but he hasn’t specified a favourite character, arc or episode.';
    else if(/\b(favou?rite|best)\b/.test(q)&&media.id==='personal:formula-one'&&/\b(driver|team)\b/.test(q))text='Sri is interested in Formula 1, but he hasn’t specified a favourite driver or team.';
    else if(/\bwhy\b/.test(q)&&media.id==='personal:batman')text='That’s a crocheted Batman collectible. I don’t have a story about a favourite superhero from Sri yet.';
    else text=target?.why||media.reply;
  }
  return {text,links:[],mediaId:media.id,topicId:media.entityId||'interests',tour:null,...(named?{mediaQueue:null,replaceMedia:true}:{})};
}
export function personalReply(question,context={}) {
  const q=canonicalQuery(question);
  if(resolveProjectId(question))return null;
  const photo=/\b(images?|photos?|pictures?|portraits?)\b/.test(q),namedInterest=targets.some(target=>target.pattern.test(q));
  const owner=/\b(sri|villiam|william|villain|vilian|my|owner|developer)\b/.test(q)||/\b(?:images?|photos?|pictures?|portraits?) of (?:him|he|his|me)\b|\b(?:his|he|him) (?:own )?(?:images?|photos?|pictures?|portraits?)\b/.test(q)||/\b(two|both|2)\b/.test(q)&&/\b(he|his|him)\b/.test(q);
  if(photo&&!namedInterest&&owner&&!/\b(projects|certificates|school|childhood|baby)\b/.test(q)){
    const both=/\b(two|both|2)\b|\b(?:photos|pictures|images|portraits)\b/.test(q),portraits=portraitIds.map(mediaFor).filter(Boolean);
    if(portraits.length){
      const media=/\b(mirror|red shirt)\b/.test(q)?portraits.find(item=>item.id===portraitIds[1])||portraits[0]:portraits[0];
      if(/\b(where|when|date|location|what year)\b/.test(q))return answer(media,q,{named:true});
      const text=both?'These are Villiam’s two portraits: an outdoor portrait and a mirror portrait in a red shirt. They introduce the developer behind the portfolio.':media.reply;
      return {text:text+(/\bwhy\b/.test(q)?' He hasn’t shared a more specific story about why he chose these portraits.':''),links:[],mediaId:media.id,topicId:'about',mediaQueue:both?portraits.map(item=>item.id):null,tour:null,replaceMedia:true};
    }
  }
  if(photo&&/\b(mirror|outdoor|red shirt|striped shirt)\b/.test(q)){const media=mediaFor(/\b(mirror|red shirt)\b/.test(q)?portraitIds[1]:portraitIds[0]);if(media)return answer(media,q,{named:true});}
  if(unrelated.test(q))return null;
  const named=targets.map(target=>({target,index:q.search(target.pattern)})).filter(item=>item.index>=0).sort((a,b)=>a.index-b.index).map(item=>mediaFor(item.target.id)).filter(Boolean);
  if(named.length){
    if(named.length===1)return answer(named[0],q,{named:true});
    const first=named[0],summaries={
      'personal:lionel-messi':'Messi connects to his enjoyment of watching football and playing on weekends',
      'personal:cricket':'Dhoni represents his interest in cricket',
      'personal:formula-one':'Formula 1 reflects his interest in racing',
      'personal:developer-workspace':'the laptop shows his development work',
      'personal:mongodb-coffee':'the MongoDB.local picture relates to an event he already attended',
      'personal:naruto':'Naruto represents his anime interest',
      'personal:basketball':'Michael Jordan represents his interest in basketball'
    };
    return {text:named.map(media=>summaries[media.id]).join('; ')+'. I’m showing the first picture; say “next picture” to see the next one.',links:[],mediaId:first.id,topicId:first.entityId,mediaQueue:named.map(media=>media.id),tour:null};
  }
  const selected=mediaFor(context.mediaId);
  const queue=(context.mediaQueue||[]).map(mediaFor).filter(Boolean);
  const navigation=q.match(nextPhoto);
  if(selected&&portraitIds.includes(selected.id)&&navigation&&!queue.length){const next=mediaFor(portraitIds.find(id=>id!==selected.id));if(next)return answer(next,q,{named:true});}
  if(selected&&navigation&&queue.some(media=>media.id===selected.id)){
    const index=queue.findIndex(media=>media.id===selected.id),direction=navigation[1]==='previous'?-1:1,next=queue[index+direction];
    if(!next)return {text:direction>0?'That’s the last of the pictures you asked about. Which one would you like to explore?':'That’s the first of the pictures you asked about.',links:[],topicId:context.topicId,mediaQueue:queue.map(media=>media.id),tour:null};
    return {...answer(next,''),mediaQueue:queue.map(media=>media.id),replaceMedia:true};
  }
  const referring=photoWords.test(q)&&/\b(show|open|display|what|tell|describe|explain|who|where|when|why|this|that|had|has)\b/.test(q)||/\b(tell me about|describe|explain) (this|that)\b/.test(q)||/^(?:who|what|where|when) (?:is|s|was) (?:in )?(?:this|that)(?: person| one)?$/.test(q)||/^is (?:this|that) sri$/.test(q)||/\b(when|where)\b/.test(q)&&/\b(this|that)\b/.test(q)||photoFollow.test(q)||context.topicId==='interest:mongodb-event'&&/\b(event|attend|attended)\b/.test(q);
  if(selected&&referring)return answer(selected,q);
  // Short follow-ups can also refer to an interest discussed without an image.
  if(!selected&&context.topicId?.startsWith('interest:')&&photoFollow.test(q)){
    const media=assistantMedia.find(item=>item.group==='personal'&&item.entityId===context.topicId);
    if(media)return answer(media,q);
  }
  return null;
}
