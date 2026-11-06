import React from 'react';
const paths={
  folder:'M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z',
  mail:'M3 5h18v14H3V5Zm0 1 9 7 9-7',
  arrow:'m7 17 10-10M7 7h10v10',up:'m6 11 6-6 6 6M12 5v15',back:'m14 6-6 6 6 6',
  mic:'M9 4a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0V4ZM5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8',
  sound:'M3 9h4l5-4v14l-5-4H3V9Zm13-2a7 7 0 0 1 0 10m3-13a11 11 0 0 1 0 16',
  type:'M3 5h18v14H3V5Zm4 5h.01M11 10h.01M15 10h.01M7 14h10',
  voice:'M4 10v4M8 6v12M12 3v18M16 6v12M20 10v4',
  transcript:'M5 5h14M5 10h14M5 15h14M5 20h8',close:'m6 6 12 12M6 18 18 6',
  trash:'M4 7h16M9 7V3h6v4M6 7l1 14h10l1-14M10 11v6M14 11v6',
  github:'M9 19c-4 1-4-2-6-2m12 5v-4a4 4 0 0 0-1-3c3 0 6-2 6-5a4 4 0 0 0-1-3 4 4 0 0 0 0-4s-2 0-4 2a12 12 0 0 0-6 0C7 3 5 3 5 3a4 4 0 0 0 0 4 4 4 0 0 0-1 3c0 3 3 5 6 5a4 4 0 0 0-1 3v4',
  linkedin:'M5 9v12M5 4v.1M10 21V9h4v2a4 4 0 0 1 7 3v7M2 9h5M2 21h5',
};
export default function VillIcon({name,...props}){return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]||paths.arrow}/></svg>;}
