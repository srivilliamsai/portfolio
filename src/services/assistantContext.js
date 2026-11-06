const collections=new Set(['projects','achievements','certificates','contributions']);
export function sanitizeAssistantContext(value={}) {
  const context={};
  for(const key of ['topicId','mediaId'])if(value?.[key]===null||typeof value?.[key]==='string'&&value[key].length<=150)context[key]=value[key];
  if(value?.mediaQueue===null)context.mediaQueue=null;
  else if(Array.isArray(value?.mediaQueue)&&value.mediaQueue.length<=12&&value.mediaQueue.every(id=>typeof id==='string'&&/^personal:[a-z0-9-]{1,80}$/.test(id)))context.mediaQueue=[...new Set(value.mediaQueue)];
  if(Number.isInteger(value?.detailLevel)&&value.detailLevel>=0&&value.detailLevel<=3)context.detailLevel=value.detailLevel;
  if(Array.isArray(value?.coveredSections)&&value.coveredSections.length<=20&&value.coveredSections.every(id=>typeof id==='string'&&/^[a-z][a-z0-9-]{0,59}$/.test(id)))context.coveredSections=[...new Set(value.coveredSections)];
  if(value?.answerScope===null||['projects','project','project-technologies','achievement-technologies','background-projects','achievement','achievements','awards','certificates','credly','contributions','skills','experience','education','interests','programming-languages','spoken-languages','assistant','owner'].includes(value?.answerScope))context.answerScope=value.answerScope;
  if(value?.clarificationId==='earphone')context.clarificationId=value.clarificationId;
  const tour=value?.tour;
  if(tour===null)context.tour=null;
  else if(tour&&collections.has(tour.collection)&&Number.isInteger(tour.index)&&tour.index>=0&&tour.index<100)context.tour={collection:tour.collection,index:tour.index};
  return context;
}
export function mergeAssistantContext(context,reply) {
  const next={...sanitizeAssistantContext(context),...sanitizeAssistantContext(reply)};
  if(!reply?.needsClarification)delete next.clarificationId;
  if(reply?.clearMedia){next.mediaId=null;delete next.mediaQueue;}
  if(reply?.topicId!==undefined&&reply.topicId!==context?.topicId){
    if(!Object.hasOwn(reply,'mediaQueue'))delete next.mediaQueue;
    if(!Object.hasOwn(reply,'detailLevel'))delete next.detailLevel;
    if(!Object.hasOwn(reply,'answerScope'))delete next.answerScope;
    if(!Object.hasOwn(reply,'coveredSections'))delete next.coveredSections;
  }
  return next;
}
