import {assistantMusic} from '../data/assistantMusic.js';
import {canonicalQuery} from './assistantQuery.js';
export function spotifyEmbedUrl(value){try{const url=new URL(value);if(url.protocol!=='https:'||url.hostname!=='open.spotify.com'||url.username||url.password||url.port)return null;const match=url.pathname.match(/^\/(?:embed\/)?(track|album|playlist)\/([A-Za-z0-9]{22})\/?$/);return match?`https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`:null;}catch{return null;}}
export function musicReply(question,context={}){
  const q=canonicalQuery(question),named=assistantMusic.find(track=>q.includes(canonicalQuery(track.title)));
  const generic=/\b(songs?|music|spotify|playlist|listening to|on repeat)\b/.test(q);
  const next=context.topicId==='music'&&/^(?:(?:ok|okay|and|play|show|please) )*(?:next|another|previous)(?: song| track)?$/.test(q);
  if(!named&&!generic&&!next)return null;
  let selected=named||assistantMusic[0];
  if(next){const index=assistantMusic.findIndex(item=>item.id===context.mediaId),target=index+(/\bprevious\b/.test(q)?-1:1);selected=assistantMusic[target];if(!selected)return {text:'That’s the end of the selected tracks. Which one would you like to revisit?',links:[],topicId:'music'};}
  return {text:named||next?selected.reply:`The music selection is ${assistantMusic.map(item=>item.title).join(', ')}. Here’s the first track; you can play it in the Spotify player.`,links:[{label:'Open in Spotify',href:selected.spotifyUrl}],topicId:'music',mediaId:selected.id,tour:null,replaceMedia:Boolean(named||next)};
}
