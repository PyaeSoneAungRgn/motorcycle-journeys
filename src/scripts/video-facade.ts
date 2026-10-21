const thumbnails = document.querySelectorAll<HTMLImageElement>('img[data-yt-thumb]');

function useFallback(image: HTMLImageElement) {
  const id = image.dataset.ytThumb;
  if (!id || image.dataset.fallback === 'hq') {
    image.style.visibility = 'hidden';
    return;
  }
  image.dataset.fallback = 'hq';
  image.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

thumbnails.forEach((image) => {
  image.addEventListener('error', () => useFallback(image), { once: true });
  if (image.complete && image.naturalWidth === 0) useFallback(image);
});

document.addEventListener('click', (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-play]');
  if (!button) return;

  const player = button.closest<HTMLElement>('[data-player]');
  const id = player?.dataset.videoId;
  if (!player || !id) return;

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  iframe.title = player.dataset.videoTitle ?? 'YouTube film';
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';

  player.replaceChildren(iframe);
  player.classList.add('is-playing');
  iframe.focus();
});
