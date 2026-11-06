import {assistantText} from './assistantText.js';

// Keep captions on the current turn; the transcript retains every complete reply.
export function tourPresentation({state,partial='',heard='',lastMessage,mic=false,welcome='',mode='type',live=false,canInterrupt=false}) {
  const isUser=state==='listening'||Boolean(heard&&!partial&&!['speaking','excited'].includes(state));
  const waiting=state==='thinking'||state==='connecting';
  const text=assistantText(isUser?heard:mode==='voice'?partial:partial||(waiting?'':lastMessage?.content||welcome));
  const [primary,secondary]=state==='connecting'?['Connecting…','']:state==='listening'?['Listening','Just talk']:state==='thinking'?['Thinking…','']:['speaking','excited'].includes(state)?['WILL is talking',(live||canInterrupt)&&mic?'Talk to interrupt':'Tap WILL to skip']:state==='sleeping'?['WILL dozed off','Tap to wake']:mic?['Your turn','Just talk']:['Ready','Type a question'];
  return {text,isUser,primary,secondary};
}

// Absolute word positions keep existing words mounted as streamed sentences advance.
export function captionWords(value) {
  const text=assistantText(value).replace(/\s+/g,' ').trim();
  if(!text)return [];
  const recent=text.split(/(?<=[.!?…])\s+/).slice(-2).join(' ');
  const words=recent.split(' '),offset=text.split(' ').length-words.length;
  return words.map((word,index)=>({word,index:offset+index}));
}
