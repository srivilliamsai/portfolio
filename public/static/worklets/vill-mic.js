class VillMic extends AudioWorkletProcessor {
  constructor(){super();this.pending=[];this.position=0;}
  process(inputs){
    const channel=inputs[0]?.[0];if(!channel)return true;
    const step=sampleRate/16000;
    for(;this.position<channel.length;this.position+=step){this.pending.push(Math.max(-32768,Math.min(32767,Math.round(channel[Math.floor(this.position)]*32767))));if(this.pending.length===640){const buffer=new Int16Array(this.pending).buffer;this.port.postMessage(buffer,[buffer]);this.pending=[];}}
    this.position-=channel.length;return true;
  }
}
registerProcessor('vill-mic',VillMic);
