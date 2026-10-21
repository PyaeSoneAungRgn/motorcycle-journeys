const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-timelapse]').forEach((media) => {
  const video = media.querySelector<HTMLVideoElement>('[data-timelapse-video]');
  const toggle = media.querySelector<HTMLButtonElement>('[data-timelapse-toggle]');
  if (!video || !toggle) return;

  const canAutoplay = media.dataset.autoplay !== 'false';
  let userPaused = false;

  const setState = (playing: boolean) => {
    toggle.textContent = playing ? 'Pause' : 'Play';
    toggle.setAttribute('aria-label', playing ? 'Pause time lapse' : 'Play time lapse');
    media.classList.toggle('is-playing', playing);
  };

  const play = () => {
    const attempt = video.play();
    if (attempt) {
      attempt.catch(() => setState(false));
    }
  };

  toggle.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      play();
    } else {
      userPaused = true;
      video.pause();
      setState(false);
    }
  });

  video.addEventListener('play', () => setState(true));
  video.addEventListener('pause', () => setState(false));

  if (reducedMotion || !canAutoplay) {
    setState(false);
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!userPaused) play();
          } else if (!video.paused) {
            video.pause();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(media);
  } else {
    play();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !video.paused) video.pause();
  });
});
