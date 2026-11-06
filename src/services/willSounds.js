// Synthesized from the public reference tour's Web Audio effects.
// at is injectable for OfflineAudioContext rendering; normal playback uses now.
export function playWillEffect(kind,{context,connect,at=context.currentTime}) {
  function notes(sequence,volume=.05) {
    for(const note of sequence){
      const source=context.createOscillator(),gain=context.createGain(),start=at+.01+(note.time||0);
      source.type=note.type||'square';
      source.frequency.setValueAtTime(note.frequency,start);
      if(note.to)source.frequency.exponentialRampToValueAtTime(note.to,start+note.duration);
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.exponentialRampToValueAtTime(volume*(note.level??1),start+.008);
      gain.gain.exponentialRampToValueAtTime(.0001,start+note.duration);
      connect(source,gain);source.start(start);source.stop(start+note.duration+.02);
    }
  }
  function noise(duration,level,from,to) {
    const buffer=context.createBuffer(1,Math.floor(context.sampleRate*duration),context.sampleRate);
    const data=buffer.getChannelData(0);for(let index=0;index<data.length;index++)data[index]=Math.random()*2-1;
    const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
    source.buffer=buffer;filter.type='bandpass';
    filter.frequency.setValueAtTime(from,at);filter.frequency.exponentialRampToValueAtTime(to,at+duration);
    gain.gain.setValueAtTime(level,at);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
    connect(source,gain,[filter]);source.start(at);source.stop(at+duration);
  }
  if(kind==='open') {
    noise(.35,.05,6000,800);
    notes([{frequency:110,to:880,time:.05,duration:.28,type:'sawtooth',level:.5},{frequency:1320,time:.34,duration:.08,level:.6},{frequency:1760,time:.42,duration:.12,level:.6}]);
  }else if(kind==='close') {
    notes([{frequency:700,to:60,duration:.3,type:'sawtooth',level:.6}]);noise(.12,.04,2000,200);
  }else if(kind==='click') notes([{frequency:1800,duration:.025,level:.6}],.03);
  else if(kind==='select') notes([{frequency:988,duration:.08,type:'triangle'},{frequency:1318,time:.08,duration:.18,type:'triangle'}],.045);
  else if(kind==='send') notes([{frequency:1046,duration:.06},{frequency:784,time:.06,duration:.06},{frequency:1318,time:.12,duration:.1}],.035);
  else if(kind==='listen') notes([{frequency:660,duration:.07},{frequency:990,time:.07,duration:.09}],.035);
  else if(kind==='think') notes([523,659,784,659,880,1046].map((frequency,index)=>({frequency,time:index*.045,duration:.04,type:'triangle'})),.03);
  else if(kind==='transcript') notes([{frequency:440,to:880,duration:.1,type:'triangle'}],.04);
  else return false;
  return true;
}
