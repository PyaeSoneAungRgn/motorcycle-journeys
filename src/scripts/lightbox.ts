const element = document.getElementById('lightbox') as HTMLDialogElement | null;
if (element && typeof element.showModal === 'function') {
  const dialog: HTMLDialogElement = element;
  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]');
  const counter = dialog.querySelector<HTMLElement>('[data-lightbox-count]');
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]');
  const location = dialog.querySelector<HTMLElement>('[data-lightbox-location]');
  const film = dialog.querySelector<HTMLElement>('[data-lightbox-film]');
  const previous = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]');
  const next = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]');
  const closeButton = dialog.querySelector<HTMLButtonElement>('.lightbox__close');
  const stage = dialog.querySelector<HTMLElement>('.lightbox__stage');

  let items: HTMLAnchorElement[] = [];
  let index = 0;
  let trigger: HTMLElement | null = null;

  function collect() {
    items = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-photo]')).filter(
      (item) => !item.hidden && !item.closest('[hidden]'),
    );
  }

  function preload(target: number) {
    const item = items[(target + items.length) % items.length];
    if (!item) return;
    const src = item.dataset.full ?? item.href;
    if (src) {
      const preloaded = new Image();
      preloaded.src = src;
    }
  }

  function show(target: number) {
    if (!items.length || !image) return;

    index = (target + items.length) % items.length;
    const item = items[index];
    const src = item.dataset.full ?? item.href;
    const alt = item.dataset.alt ?? '';
    const place = item.dataset.location ?? '';
    const stock = item.dataset.film ?? '';

    image.src = src;
    image.alt = alt;

    if (caption) caption.textContent = item.dataset.caption ?? '';
    if (location) location.textContent = place;
    if (film) film.textContent = stock;
    if (counter) {
      counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    }

    preload(index + 1);
    preload(index - 1);
  }

  function open(target: HTMLAnchorElement) {
    collect();
    const position = items.indexOf(target);
    if (position === -1) return;

    trigger = target;
    show(position);
    dialog.showModal();
    document.documentElement.classList.add('lightbox-open');
    closeButton?.focus();
  }

  function close() {
    dialog.close();
  }

  document.addEventListener('click', (event) => {
    const target = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[data-photo]');
    if (!target) return;
    event.preventDefault();
    open(target);
  });

  previous?.addEventListener('click', () => show(index - 1));
  next?.addEventListener('click', () => show(index + 1));

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      show(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      show(items.length - 1);
    }
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target === stage) close();
  });

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    trigger?.focus();
    trigger = null;
  });

  let touchStartX = 0;
  stage?.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true },
  );
  stage?.addEventListener(
    'touchend',
    (event) => {
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const delta = endX - touchStartX;
      if (Math.abs(delta) > 48) show(delta > 0 ? index - 1 : index + 1);
    },
    { passive: true },
  );
}
