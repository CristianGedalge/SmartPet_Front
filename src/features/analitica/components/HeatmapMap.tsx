import { useEffect, useRef, useState } from "react";
import {
  LngLatBounds,
  Map as LibreMap,
  NavigationControl,
  Popup,
  type GeoJSONSource,
  type MapMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLE_URL } from "../../../config/map.config";
import { Button } from "../../../components/ui/button";
import type { HeatmapData } from "../types/heatmap.types";

function fit(map: LibreMap, data: HeatmapData) {
  if (!data.features.length) return;
  const bounds = new LngLatBounds();
  data.features.forEach(({ geometry }) =>
    bounds.extend([geometry.coordinates[0], geometry.coordinates[1]]),
  );
  map.fitBounds(bounds, { padding: 65, maxZoom: 13, duration: 0 });
}

function MapCanvas({ data }: { data: HeatmapData }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LibreMap | null>(null);
  const latest = useRef(data);
  const popupRef = useRef<Popup | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    latest.current = data;
    popupRef.current?.remove();
    const map = mapRef.current;
    if (!map?.getSource("reportes")) return;
    (map.getSource("reportes") as GeoJSONSource).setData(data);
    map.setPaintProperty("concentracion", "heatmap-weight", [
      "/",
      ["get", "cantidad"],
      Math.max(1, ...data.features.map((f) => f.properties.cantidad)),
    ]);
    fit(map, data);
  }, [data]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let map: LibreMap;
    let disposed = false;
    try {
      map = new LibreMap({
        container: element,
        style: MAP_STYLE_URL,
        center: [-64.7, -17],
        zoom: 5,
        minZoom: 2,
        maxZoom: 18,
      });
    } catch {
      queueMicrotask(() => {
        if (!disposed) setStatus("error");
      });
      return () => {
        disposed = true;
        element.replaceChildren();
      };
    }
    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    const load = () => {
      const current = latest.current;
      map.addSource("reportes", { type: "geojson", data: current });
      map.addLayer({
        id: "concentracion",
        type: "heatmap",
        source: "reportes",
        paint: {
          "heatmap-weight": [
            "/",
            ["get", "cantidad"],
            Math.max(1, ...current.features.map((f) => f.properties.cantidad)),
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            2,
            1,
            14,
            2,
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            2,
            18,
            14,
            55,
          ],
          "heatmap-opacity": 0.8,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.15,
            "#38bdf8",
            0.35,
            "#2dd4bf",
            0.55,
            "#fde047",
            0.75,
            "#fb923c",
            1,
            "#e11d48",
          ],
        },
      });
      map.addLayer({
        id: "zonas",
        type: "circle",
        source: "reportes",
        minzoom: 12,
        paint: {
          "circle-radius": 7,
          "circle-color": "#047857",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });
      fit(map, current);
      if (!disposed) setStatus("ready");
    };
    const click = (event: MapMouseEvent) => {
      if (!map.getLayer("zonas")) return;
      const feature = map.queryRenderedFeatures(event.point, {
        layers: ["zonas"],
      })[0];
      if (!feature || feature.geometry.type !== "Point") return;
      popupRef.current?.remove();
      popupRef.current = new Popup({ closeButton: true })
        .setLngLat([
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        ])
        .setText(
          `${Number(feature.properties.cantidad)} reportes en esta zona. Ubicación aproximada.`,
        )
        .addTo(map);
    };
    const error = () => {
      if (!disposed) setStatus("error");
    };
    map.on("load", load);
    map.on("click", click);
    map.on("error", error);
    const observer = new ResizeObserver(() => map.resize());
    observer.observe(element);
    return () => {
      disposed = true;
      observer.disconnect();
      map.off("load", load);
      map.off("click", click);
      map.off("error", error);
      popupRef.current?.remove();
      popupRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={container}
        className="heatmap-map h-[430px] w-full rounded-2xl sm:h-[560px]"
        data-ready={status === "ready"}
        aria-label="Mapa de concentración de reportes"
      />
      {status === "loading" && (
        <p
          role="status"
          className="absolute left-4 top-4 rounded-lg bg-white px-3 py-2 text-sm shadow"
        >
          Cargando mapa…
        </p>
      )}
      {status === "error" && (
        <p
          role="alert"
          className="absolute left-4 right-14 top-4 rounded-lg bg-white px-3 py-2 text-sm text-red-700 shadow"
        >
          No se pudo cargar el mapa. Comprueba tu conexión y el soporte WebGL
          del navegador.
        </p>
      )}
      <Button
        variant="outline"
        className="absolute bottom-10 left-3 shadow-sm"
        disabled={status !== "ready" || !data.features.length}
        onClick={() => {
          if (mapRef.current) fit(mapRef.current, latest.current);
        }}
      >
        Ver todos los reportes
      </Button>
    </div>
  );
}

export function HeatmapMap({ data }: { data: HeatmapData }) {
  const [attempt, setAttempt] = useState(0);
  return (
    <>
      <MapCanvas key={attempt} data={data} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Acerca el mapa para consultar la cantidad de reportes por zona.
        </span>
        <button
          type="button"
          className="font-medium text-emerald-700 underline"
          onClick={() => setAttempt((value) => value + 1)}
        >
          Recargar mapa
        </button>
      </div>
    </>
  );
}
