// The owner requested these same reference selections, without a listening-history claim.
export const assistantMusic=[
  ['3ZCTVFBt2Brf31RLEnCkWJ','everything i wanted','/static/media/assistant/song-everything-i-wanted.jpg'],
  ['3QaPy1KgI7nu9FJEQUgn6h','WILDFLOWER','/static/media/assistant/song-wildflower.jpg'],
  ['1ZriJmDC61hn2z2eajgooI','Kanwal','/static/media/assistant/song-kanwal.jpg'],
].map(([spotifyId,title,src])=>({id:`song:${spotifyId}`,kind:'song',group:'personal',entityId:'music',spotifyUrl:`https://open.spotify.com/track/${spotifyId}`,src,thumbnail:src,width:300,height:300,title,description:`${title}, selected for this portfolio’s Spotify player.`,reply:`Here’s ${title}, one of the tracks selected for this portfolio.`,placeholder:false}));
