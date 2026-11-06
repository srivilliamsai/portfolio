// Orthographic board geometry shared by the six product operation models.
export const operationSlots = [
  {x:24,y:20,width:48,depth:42,height:36},
  {x:104,y:20,width:48,depth:42,height:48},
  {x:184,y:20,width:48,depth:42,height:34},
  {x:24,y:112,width:48,depth:42,height:44},
  {x:104,y:112,width:48,depth:42,height:32},
  {x:184,y:112,width:48,depth:42,height:40},
];
export function isoPoint(x,y,z=0) {
  return [220+(x-y)*.82,80+(x+y)*.43-z];
}
export const svgPoints = points => points.map(point=>point.map(value=>value.toFixed(2)).join(',')).join(' ');
export function isoBox({x,y,width,depth,height,z=0}) {
  const top = [[x,y],[x+width,y],[x+width,y+depth],[x,y+depth]].map(([px,py])=>isoPoint(px,py,z+height));
  const base = [[x,y],[x+width,y],[x+width,y+depth],[x,y+depth]].map(([px,py])=>isoPoint(px,py,z));
  return {top,left:[top[3],top[2],base[2],base[3]],right:[top[1],top[2],base[2],base[1]]};
}
