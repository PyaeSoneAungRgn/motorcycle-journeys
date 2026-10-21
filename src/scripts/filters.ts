document.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((group) => {
  const targetSelector = group.dataset.filterTarget;
  const target = targetSelector ? document.querySelector<HTMLElement>(targetSelector) : null;
  if (!target) return;

  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const items = Array.from(target.querySelectorAll<HTMLElement>('[data-ride]'));
  const count = group.querySelector<HTMLElement>('[data-filter-count]');
  const noun = group.dataset.filterNoun ?? 'item';

  function apply(value: string) {
    let visible = 0;

    items.forEach((item) => {
      const show = value === 'all' || item.dataset.ride === value;
      item.hidden = !show;
      if (show) visible += 1;
    });

    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === value));
    });

    if (count) {
      count.textContent = `${visible} ${noun}${visible === 1 ? '' : 's'}`;
    }
  }

  group.addEventListener('click', (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-filter]');
    if (!button) return;
    apply(button.dataset.filter ?? 'all');
  });

  const initial = buttons.find((button) => button.getAttribute('aria-pressed') === 'true');
  apply(initial?.dataset.filter ?? 'all');
});
