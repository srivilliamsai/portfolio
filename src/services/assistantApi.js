export function assistantApiPath(route,base=import.meta.env?.VITE_ASSISTANT_API_URL||'') {
  if(!/^\/(status|chat|live-session|retrieve|tts)$/.test(route))throw new Error('Unknown assistant route');
  if(!base)return '/api/assistant'+route;
  const url=new URL(base);
  if(url.username||url.password||url.search||url.hash||!(url.protocol==='https:'||url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname)))throw new Error('Assistant API must use HTTPS, or localhost for development.');
  return base.replace(/\/$/,'')+route;
}
