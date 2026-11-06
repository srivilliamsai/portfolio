import {spokenOwnerName} from '../src/services/assistantIdentity.js';

export function speechWav(parts) {
  const audio=parts.filter(part=>part.inlineData?.data&&/^audio\//i.test(part.inlineData.mimeType||''));
  if(!audio.length)throw new Error('No speech audio.');
  const mime=audio[0].inlineData.mimeType;
  if(audio.some(part=>part.inlineData.mimeType!==mime))throw new Error('Inconsistent speech format.');
  const bytes=Buffer.concat(audio.map(part=>Buffer.from(part.inlineData.data,'base64')));
  if(!bytes.length||bytes.length>10*1024*1024)throw new Error('Invalid speech size.');
  if(/^audio\/wav\b/i.test(mime)){
    if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WAVE')throw new Error('Invalid WAV audio.');
    return bytes;
  }
  if(!/^audio\/(?:l16|pcm)\b/i.test(mime)||bytes.length%2)throw new Error('Unsupported speech format.');
  const rate=Number(mime.match(/rate=(\d+)/i)?.[1]||24000);
  if(rate<8000||rate>48000)throw new Error('Unsupported speech rate.');
  const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(bytes.length+36,4);header.write('WAVEfmt ',8);
  header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);header.writeUInt32LE(rate,24);
  header.writeUInt32LE(rate*2,28);header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(bytes.length,40);
  return Buffer.concat([header,bytes]);
}

export async function synthesizeSpeech({text,env,client,signal,generateSpeech}) {
  const request={model:env.GEMINI_TTS_MODEL||'gemini-3.1-flash-tts-preview',contents:[{role:'user',parts:[{text:'Read the following aloud exactly as written, in a warm, gentle male voice at an unhurried conversational pace. Do not add a preface or commentary.\n\n'+spokenOwnerName(text)}]}],config:{responseModalities:['AUDIO'],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:env.VILL_VOICE_NAME||'Algieba'}}},abortSignal:signal}};
  const result=generateSpeech?await generateSpeech(request):await (await client()).models.generateContent(request);
  return speechWav(result.candidates?.[0]?.content?.parts||[]);
}
