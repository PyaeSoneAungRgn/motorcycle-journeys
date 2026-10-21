import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  LngLatBounds,
  setWorkerUrl,
} from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ExpressionSpecification } from 'maplibre-gl';
import type { MapPayload } from '../lib/map-types';

setWorkerUrl(workerUrl);

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
const ACCENT = '#8a4a2c';
const INK_MUTED = '#6b6459';
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The atlas draws several routes at once over a pale basemap, so its lines are
// heavier than the single-route maps and carry a wide paper halo to lift them
// off the terrain and labels.
const ATLAS_LINE = { width: 3.6, casing: 8, lineOpacity: 0.95, casingOpacity: 0.9 };
const ATLAS_ACTIVE = { width: 4.1, casing: 9.5, lineOpacity: 1, casingOpacity: 0.95 };
const ATLAS_DIMMED = { width: 2, casing: 6, lineOpacity: 0.32, casingOpacity: 0.12 };

type Entry = {
  id: string;
  lineId: string;
  casingId: string;
  markers: Marker[];
  bounds: LngLatBounds;
};

function parsePayload(shell: HTMLElement): MapPayload | null {
  const script = shell.querySelector<HTMLScriptElement>('[data-map-data]');
  if (!script?.textContent) return null;
  try {
    return JSON.parse(script.textContent) as MapPayload;
  } catch {
    return null;
  }
}

function initMap(shell: HTMLElement): void {
  const canvas = shell.querySelector<HTMLElement>('[data-map-canvas]');
  const payload = parsePayload(shell);

  if (!canvas || !payload || payload.routes.length === 0) {
    shell.classList.add('map-failed');
    return;
  }

  const { mode, routes } = payload;
  const isAtlas = mode === 'atlas';
  const isPreview = mode === 'preview';

  const map = new MapLibreMap({
    container: canvas,
    style: STYLE_URL,
    center: [100, 18],
    zoom: 4,
    minZoom: 3,
    maxZoom: 17,
    interactive: !isPreview,
    scrollZoom: false,
    dragRotate: false,
    pitchWithRotate: false,
    attributionControl: { compact: true },
    fadeDuration: 0,
  });

  if (!isPreview) {
    map.addControl(new NavigationControl({ showCompass: false }), 'bottom-left');
  }

  const entries: Entry[] = [];
  const allBounds = new LngLatBounds();

  const routeTip = new Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'map-tip map-tip--route',
    offset: 12,
    maxWidth: '260px',
  });
  let hoveredRouteId: string | null = null;

  const build = () => {
    routes.forEach((route) => {
      const coordinates = route.geometry.filter(
        ([lng, lat]) => Number.isFinite(lng) && Number.isFinite(lat),
      );

      if (coordinates.length < 2) return;

      const sourceId = `route-${route.id}`;
      const casingId = `${sourceId}-casing`;
      const lineId = `${sourceId}-line`;

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates },
        },
      });

      map.addLayer({
        id: casingId,
        type: 'line',
        source: sourceId,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#fffdf7',
          'line-width': isAtlas ? ATLAS_LINE.casing : 6.5,
          'line-opacity': isAtlas ? ATLAS_LINE.casingOpacity : 0.65,
        },
      });

      map.addLayer({
        id: lineId,
        type: 'line',
        source: sourceId,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ACCENT,
          'line-width': isAtlas ? ATLAS_LINE.width : 3,
          'line-opacity': isAtlas ? ATLAS_LINE.lineOpacity : 0.95,
          'line-dasharray': isAtlas || isPreview ? [1, 0] : [2, 1.5],
        },
      });

      const bounds = new LngLatBounds();
      coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
      route.stops.forEach((stop) => bounds.extend([stop.lng, stop.lat]));
      allBounds.extend(bounds);

      const firstStop = route.stops[0];
      const lastStop = route.stops[route.stops.length - 1];
      const closesLoop =
        Math.abs(firstStop.lat - lastStop.lat) < 1e-6 &&
        Math.abs(firstStop.lng - lastStop.lng) < 1e-6;

      const markers = route.stops.map((stop, index) => {
        const element = document.createElement('div');
        element.className = 'map-pin';
        element.textContent = String(index + 1).padStart(2, '0');
        element.title = stop.name;
        element.setAttribute('aria-label', `${index + 1}. ${stop.name}`);

        const offset: [number, number] =
          closesLoop && index === 0
            ? [-13, -13]
            : closesLoop && index === route.stops.length - 1
              ? [13, 13]
              : [0, 0];

        return new Marker({ element, anchor: 'center', offset })
          .setLngLat([stop.lng, stop.lat])
          .setPopup(
            new Popup({
              offset: 14,
              closeButton: false,
              closeOnClick: false,
              className: 'map-tip',
              maxWidth: '220px',
            }).setText(stop.name),
          );
      });

      if (mode === 'detail') {
        markers.forEach((marker) => marker.addTo(map));
      }

      entries.push({ id: route.id, lineId, casingId, markers, bounds });
    });

    if (payload.marker) {
      const element = document.createElement('div');
      element.className = 'map-pin map-pin--film';
      element.title = payload.marker.label;

      new Marker({ element, anchor: 'center' })
        .setLngLat([payload.marker.lng, payload.marker.lat])
        .setPopup(
          new Popup({
            offset: 12,
            closeButton: false,
            closeOnClick: false,
            className: 'map-tip',
            maxWidth: '220px',
          }).setText(payload.marker.label),
        )
        .addTo(map);
    }

    if (isAtlas) {
      if (routes.length === 1) activate(routes[0].id, false);
      else activate(null, false);
    } else {
      fit(allBounds, isPreview ? 9 : 11, false);
    }

    shell.dataset.mapReady = 'true';
  };

  const atlasRoot = shell.closest<HTMLElement>('[data-atlas]');
  const buttons = atlasRoot
    ? Array.from(atlasRoot.querySelectorAll<HTMLButtonElement>('[data-route-focus]'))
    : [];

  function setButtonState(activeId: string | null) {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.routeFocus === activeId));
    });
  }

  function fit(bounds: LngLatBounds, maxZoom: number, animate = !prefersReduced) {
    if (bounds.isEmpty()) return;
    map.fitBounds(bounds, {
      padding: isPreview ? 16 : isAtlas ? 52 : 44,
      maxZoom,
      animate: animate && !isPreview && !prefersReduced,
    });
  }

  function activate(activeId: string | null, animate = true) {
    hoveredRouteId = null;
    routeTip.remove();

    const hasSelection = Boolean(activeId);

    entries.forEach((entry) => {
      const active = !hasSelection || entry.id === activeId;

      map.setPaintProperty(
        entry.casingId,
        'line-opacity',
        hasSelection
          ? active
            ? ATLAS_ACTIVE.casingOpacity
            : ATLAS_DIMMED.casingOpacity
          : ATLAS_LINE.casingOpacity,
      );
      map.setPaintProperty(
        entry.casingId,
        'line-width',
        hasSelection ? (active ? ATLAS_ACTIVE.casing : ATLAS_DIMMED.casing) : ATLAS_LINE.casing,
      );
      map.setPaintProperty(entry.lineId, 'line-color', hasSelection && !active ? INK_MUTED : ACCENT);
      map.setPaintProperty(
        entry.lineId,
        'line-width',
        hasSelection ? (active ? ATLAS_ACTIVE.width : ATLAS_DIMMED.width) : ATLAS_LINE.width,
      );
      map.setPaintProperty(
        entry.lineId,
        'line-opacity',
        hasSelection
          ? active
            ? ATLAS_ACTIVE.lineOpacity
            : ATLAS_DIMMED.lineOpacity
          : ATLAS_LINE.lineOpacity,
      );

      entry.markers.forEach((marker) => {
        if (hasSelection && active) marker.addTo(map);
        else marker.remove();
      });

    });

    setButtonState(activeId);

    if (activeId) {
      const entry = entries.find((item) => item.id === activeId);
      if (entry) fit(entry.bounds, 10, animate);
    } else {
      fit(allBounds, 6, animate);
    }
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.routeFocus ?? null;
      activate(button.getAttribute('aria-pressed') === 'true' ? null : id);
    });
  });

  shell.querySelector('[data-map-reset]')?.addEventListener('click', () => activate(null));

  map.on('click', (event) => {
    if (!isAtlas) return;
    const features = map.queryRenderedFeatures(event.point, {
      layers: entries.flatMap((entry) => [entry.lineId, entry.casingId]),
    });
    const routeId = features[0]?.layer?.id
      ?.replace(/-line$|-casing$/, '')
      .replace(/^route-/, '');
    if (routeId) activate(routeId);
  });

  map.on('mousemove', (event) => {
    if (!isAtlas) return;
    const features = map.queryRenderedFeatures(event.point, {
      layers: entries.flatMap((entry) => [entry.lineId, entry.casingId]),
    });
    const routeId =
      features[0]?.layer?.id?.replace(/-line$|-casing$/, '').replace(/^route-/, '') ?? null;

    map.getCanvas().style.cursor = routeId ? 'pointer' : '';

    if (!routeId) {
      if (hoveredRouteId) {
        hoveredRouteId = null;
        routeTip.remove();
      }
      return;
    }

    if (routeId === hoveredRouteId) {
      routeTip.setLngLat(event.lngLat);
      return;
    }

    const index = routes.findIndex((route) => route.id === routeId);
    const route = routes[index];
    if (!route) return;

    hoveredRouteId = routeId;
    routeTip
      .setLngLat(event.lngLat)
      .setText(
        `${String(index + 1).padStart(2, '0')} · ${route.label ?? route.name} · ${route.distanceKm} km`,
      )
      .addTo(map);
  });

  map.getCanvas().addEventListener('mouseleave', () => {
    hoveredRouteId = null;
    routeTip.remove();
  });

  map.on('click', () => {
    hoveredRouteId = null;
    routeTip.remove();
  });

  const englishName = [
    'coalesce',
    ['get', 'name:en'],
    ['get', 'name:latin'],
    ['get', 'name'],
  ] as ExpressionSpecification;
  const minorLabels = [
    'label_village',
    'label_town',
    'label_other',
    'label_state',
    'highway-name-path',
    'highway-name-minor',
    'airport',
  ];

  const refineBasemap = () => {
    const style = map.getStyle();
    style.layers?.forEach((layer) => {
      if (layer.type !== 'symbol') return;
      if (!/^(label_|water_name|highway-name|airport$)/.test(layer.id)) return;
      try {
        map.setLayoutProperty(layer.id, 'text-field', englishName);
      } catch {
        /* label layer may not support a text override */
      }
    });

    const applyZoomLabels = () => {
      const detailed = map.getZoom() >= 6.5;
      minorLabels.forEach((id) => {
        try {
          map.setLayoutProperty(id, 'visibility', detailed ? 'visible' : 'none');
        } catch {
          /* layer not present in this style */
        }
      });
    };

    applyZoomLabels();
    map.on('zoom', applyZoomLabels);
  };

  let styleReady = false;

  map.on('style.load', () => {
    styleReady = true;
    refineBasemap();
    build();
  });

  let basemapNoteShown = false;

  map.on('error', (event) => {
    console.error('Map error', event.error);

    if (!styleReady) {
      shell.classList.add('map-failed');
      return;
    }

    if (basemapNoteShown) return;
    basemapNoteShown = true;

    const note = shell.querySelector<HTMLElement>('[data-map-note]');
    if (note) {
      note.hidden = false;
      note.textContent = 'Basemap unavailable — the route is drawn on paper.';
    }
  });

  window.setTimeout(() => {
    if (!styleReady) shell.classList.add('map-failed');
  }, 12_000);

  if ('ResizeObserver' in window) {
    let frame = 0;
    new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => map.resize());
    }).observe(canvas);
  }
}

document.querySelectorAll<HTMLElement>('[data-map]').forEach((shell) => {
  try {
    initMap(shell);
  } catch (error) {
    console.error('Map failed to initialise', error);
    shell.classList.add('map-failed');
  }
});
