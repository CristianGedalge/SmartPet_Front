import { apiClient } from "../../../api/axios.instance";
import type { HeatmapFilters, HeatmapResult } from "../types/heatmap.types";

export async function getHeatmap(filters: HeatmapFilters, signal: AbortSignal) {
  return (
    await apiClient.get<HeatmapResult>("/analitica/mapa-calor", {
      params: filters,
      signal,
    })
  ).data;
}
