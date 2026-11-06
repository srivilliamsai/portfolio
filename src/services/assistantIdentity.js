// The owner writes Villiam and pronounces it William. WILL is the assistant.
export const ownerName=Object.freeze({written:'Villiam',full:'SRI VILLIAM SAI',spoken:'William',spokenFull:'Sri William Sai'});
export const ownerNameInstruction='Refer to the portfolio owner as Villiam in everyday replies. In written replies and transcriptions spell his short name Villiam. Full-name replies must show SRI VILLIAM SAI in capitals, including SRI; use Sri only within that formal full name. Pronounce Villiam exactly like the English name William, including in full names; pronounce the full name Sri William Sai. Sri is one spoken word, pronounced shree; never read SRI as the letters S, R, I or spell out any part of the full name. The capital letters are a writing style, not initials. Keep the assistant name WILL in written replies. Pronounce WILL as the single English word Will, rhyming with hill; never spell its individual letters. Accept Sri, Villiam and William in visitor questions as aliases for the same portfolio owner.';
export const ownerSpeechInstruction='Audio pronunciation: the owner is Shree William Sai. Shree is one syllable, rhyming with tree; say the full name as three words: Shree / William / Sai. Never spell the first name as individual letters. In everyday speech call him William. The assistant is Will, one word rhyming with hill. The website formats the written names separately, so do not spell capitals aloud.';

export function displayOwnerName(value) {
  // Protect literal URLs and code: changing a name must not break an address.
  return String(value||'').replace(/https?:\/\/[^\s<>]+|mailto:[^\s<>]+|`[^`\n]*`|\b(?:(?:Sri|Shree)\s+)?(?:Villiam|William)(?:\s+Sai)?\b|\bSri\b/gi,(match,offset,source)=>{
    if(/^(?:https?:|mailto:|`)/i.test(match))return match;
    // Keep a formal name stable while its first words arrive in a caption.
    if(/^SRI(?: VILLIAM)?$/.test(match)&&!source.slice(offset+match.length).trim())return match;
    return /\bSai\b/i.test(match)?ownerName.full:ownerName.written;
  });
}
export function spokenOwnerName(value) {
  // Name substitutions preserve length: Villiam/William and WILL/Will keep caption boundaries aligned.
  return displayOwnerName(value).replace(/\bSRI VILLIAM SAI\b/g,ownerName.spokenFull).replace(/\bSRI\b/g,'Sri').replace(/\bVilliam\b/g,ownerName.spoken).replace(/\bWILL\b/g,'Will');
}
// Live model context is speech-oriented. Display formatting stays in the UI.
export const liveSpokenContext=value=>spokenOwnerName(value).replace(/\bSri\b/g,'Shree');
export function withOwnerName(record) {
  const result={...record};
  for(const key of ['text','title','summary','description','reply','content','status'])if(typeof result[key]==='string')result[key]=displayOwnerName(result[key]);
  if(result.links)result.links=result.links.map(link=>({...link,label:displayOwnerName(link.label)}));
  if(result.boundaries)result.boundaries=result.boundaries.map(displayOwnerName);
  if(result.features)result.features=result.features.map(withOwnerName);
  return result;
}
export const canonicalOwnerQuery=value=>value.replace(/\b(?:sri\s+)?(?:villiam|william)(?:\s+sai)?\b/g,'sri');
