import type { FeatureCollection, Point } from "geojson";

export type HeatmapType = "ALERTAS" | "AVISTAMIENTOS";
export interface HeatmapFilters {
  tipo: HeatmapType;
  estado: string;
  desde?: string;
  hasta?: string;
}
export type HeatmapData = FeatureCollection<Point, { cantidad: number }>;
export interface HeatmapResult extends Omit<HeatmapFilters, "desde" | "hasta"> {
  desde: string | null;
  hasta: string | null;
  totalReportes: number;
  datos: HeatmapData;
}
export const EMPTY_HEATMAP: HeatmapData = {
  type: "FeatureCollection",
  features: [],
};
