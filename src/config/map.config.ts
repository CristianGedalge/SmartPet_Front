import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

setWorkerUrl(workerUrl);

export const MAP_STYLE_URL =
  (import.meta.env.VITE_MAP_STYLE_URL as string | undefined)?.trim() ||
  "https://tiles.openfreemap.org/styles/liberty";
