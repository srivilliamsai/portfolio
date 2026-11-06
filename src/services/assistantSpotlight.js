import {galleryMedia} from './assistantGallery.js';
import {assistantMedia} from '../data/assistantMedia.js';

const aliases={dinedesk:/\bdine\s?desk\b/i,'invoice-picker':/\binvoice\s?picker\b/i,pitstop:/\bpit\s?stop\b/i,'carbon-footprint':/\bcarbon\s+(?:personal\s+)?footprint\b/i,glassora:/\bglassora\b/i,wyndra:/\bwyndra\b/i,'personal:lionel-messi':/\bmessi\b/i,'personal:cricket':/\bdhoni\b/i,'personal:naruto':/\bnaruto\b/i,'personal:mongodb-coffee':/\bmongodb(?:\.local)?\b/i};
export function sentenceMedia(sentence,currentId=null,reply=null) {
  // A sentence mentioning a name is not permission to open that project's card.
  // Lists and comparisons must keep the answer's explicit media scope.
  if(reply&&(reply.clearMedia||!reply.mediaId))return null;
  const matches=Object.entries(aliases).filter(([,pattern])=>pattern.test(sentence)).sort((a,b)=>sentence.search(a[1])-sentence.search(b[1]));
  const id=matches[0]?.[0];if(!id)return null;
  const scoped=reply&&assistantMedia.find(media=>media.id===reply.mediaId);
  if(reply&&(!scoped||(scoped.id!==id&&scoped.entityId!==id)))return null;
  const current=galleryMedia.find(media=>media.id===currentId);
  if(current&&(current.id===id||current.entityId===id))return current.id;
  const options=galleryMedia.filter(media=>media.id===id||media.entityId===id);
  return (options.find(media=>media.primary)||options[0])?.id||null;
}

// A selection lasts until dismissal or a relevant topic change, independent of
// speech duration. Turn tokens reject callbacks from interrupted answers.
export function createMediaSelection({onChange=()=>{}}={}) {
  let selectedId=null,turn=0,locked=false,manual=false;
  const media=id=>assistantMedia.find(item=>item.id===id&&!item.placeholder);
  const update=id=>{if(selectedId!==id){selectedId=id;onChange(id);}return selectedId;};
  return {
    get selectedId(){return selectedId;},
    isCurrent(token){return token===turn;},
    beginTurn(){locked=false;return ++turn;},
    invalidate(){locked=true;turn++;},
    reset(){turn++;locked=false;manual=false;update(null);},
    isLocked(token){return token!==turn||locked;},
    choose(id){if(id!==null&&!media(id))return selectedId;locked=true;manual=true;return update(id);},
    apply(reply,token){
      if(token!==turn||locked)return selectedId;
      if(reply.dismissMedia){manual=false;return update(null);}
      if(reply.clearMedia){if(!manual)return update(null);return selectedId;}
      const next=media(reply.mediaId),selected=media(selectedId);
      if(next){
        if(manual&&!reply.replaceMedia&&selected?.entityId===next.entityId)return selectedId;
        manual=false;return update(next.id);
      }
      if(!manual&&reply.topicId&&selected?.entityId!==reply.topicId)update(null);
      return selectedId;
    }
  };
}
