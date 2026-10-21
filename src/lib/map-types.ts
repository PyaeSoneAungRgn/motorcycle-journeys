export type MapStop = {
  name: string;
  lat: number;
  lng: number;
  note?: string;
};

export type MapRoute = {
  id: string;
  name: string;
  region: string;
  label?: string;
  distanceKm: number;
  days: number;
  geometry: [number, number][];
  stops: MapStop[];
};

export type MapMode = 'preview' | 'detail' | 'atlas';

export type MapPayload = {
  mode: MapMode;
  routes: MapRoute[];
  marker?: { lat: number; lng: number; label: string };
};
