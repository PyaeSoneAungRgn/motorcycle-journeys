export type RouteGeometry = {
  type: 'LineString';
  coordinates: [number, number][];
};

const files = import.meta.glob<RouteGeometry>('../data/routes/*.json', {
  eager: true,
  import: 'default',
});

const byId = new Map<string, RouteGeometry>(
  Object.entries(files).map(([path, geometry]) => [
    (path.split('/').pop() ?? path).replace(/\.json$/, ''),
    geometry,
  ]),
);

/** Road-following geometry generated once by scripts/fetch-routes.mjs. */
export function getRouteGeometry(id: string): RouteGeometry {
  const geometry = byId.get(id);
  if (!geometry) {
    throw new Error(
      `No route geometry for "${id}". Run \`pnpm routes\` to generate src/data/routes/${id}.json.`,
    );
  }
  return geometry;
}

export function sparklinePoints(
  coordinates: [number, number][],
  width = 100,
  height = 30,
): string {
  if (coordinates.length < 2) return '';
  const lats = coordinates.map(([, lat]) => lat);
  const lngs = coordinates.map(([lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const dx = maxLng - minLng || 1;
  const dy = maxLat - minLat || 1;
  const pad = 2;
  return coordinates
    .map(([lng, lat]) => {
      const x = pad + ((lng - minLng) / dx) * (width - pad * 2);
      const y = height - pad - ((lat - minLat) / dy) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}
