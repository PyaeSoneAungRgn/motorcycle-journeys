export function youtubeThumb(youtubeId: string, quality: 'maxresdefault' | 'hqdefault' = 'maxresdefault') {
  return `https://i.ytimg.com/vi/${youtubeId}/${quality}.jpg`;
}

export function youtubeUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
