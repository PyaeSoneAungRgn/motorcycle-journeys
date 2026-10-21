document.querySelectorAll<HTMLElement>('[data-clip]').forEach((media) => {
  const play = media.querySelector<HTMLButtonElement>('[data-clip-play]');
  if (!play) return;

  play.addEventListener('click', () => {
    if (media.classList.contains('is-playing')) return;

    const src = media.dataset.src;
    if (!src) return;

    const video = document.createElement('video');
    video.className = 'clip-card__video';
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('aria-label', media.dataset.title ?? 'Short film');

    media.replaceChildren(video);
    media.classList.add('is-playing');
    video.play().catch(() => {
      /* native controls remain available if autoplay is blocked */
    });
  });
});
