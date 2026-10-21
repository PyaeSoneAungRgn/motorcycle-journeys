const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Bangkok',
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Bangkok',
});

export function formatShortDate(date: Date): string {
  return shortDateFormatter.format(date);
}

export function formatDistance(km: number): string {
  return `${km.toLocaleString('en-GB')} km`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-GB');
}

/** "23:06" or "1:03:57" → "PT23M6S" / "PT1H3M57S" */
export function durationToIso(duration: string): string {
  const parts = duration.split(':').map((part) => Number.parseInt(part, 10) || 0);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
  } else {
    [seconds] = parts;
  }

  return (
    `PT${hours ? `${hours}H` : ''}${minutes ? `${minutes}M` : ''}${seconds ? `${seconds}S` : ''}` ||
    'PT0S'
  );
}
