export const SITE = {
  name: 'Pyae Sone Aung',
  shortName: 'Pyae',
  url: 'https://pyaesoneaung.dev',
  title: 'Pyae Sone Aung — Motorcycle Journals',
  description:
    'Photographs, films and route notes from motorcycle journeys through Thailand and Vietnam — Chiang Mai, Pai, Nan, the Daibutsu at Doi Phra Chan, the Hai Van Pass and Doi Inthanon, and wherever the road goes next.',
  email: 'hello@pyaesoneaung.dev',
  defaultImage: 'nan-sky-road.jpg',
  socials: {
    youtube: 'https://www.youtube.com/@psa-adventure',
  },
} as const;

export const NAV = [
  { href: '/rides', label: 'Rides' },
  { href: '/places', label: 'Places' },
  { href: '/photos', label: 'Photographs' },
  { href: '/vlogs', label: 'Vlogs' },
  { href: '/atlas', label: 'Atlas' },
  { href: '/about', label: 'About' },
] as const;
