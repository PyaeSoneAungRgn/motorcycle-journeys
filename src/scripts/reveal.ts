const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
if (elements.length) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    );

    elements.forEach((element) => observer.observe(element));
  }
}
