import { useCallback, useState, type FormEvent } from "react";
import { MapPinned, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useApiResource } from "../../../hooks/useApiResource";
import { HeatmapMap } from "../components/HeatmapMap";
import { getHeatmap } from "../services/analitica.service";
import {
  EMPTY_HEATMAP,
  type HeatmapFilters,
  type HeatmapType,
} from "../types/heatmap.types";

const states = {
  ALERTAS: [
    ["ACTIVA", "Activas"],
    ["RESUELTA", "Resueltas"],
    ["CANCELADA", "Canceladas"],
    ["TODOS", "Todos los estados visibles"],
  ],
  AVISTAMIENTOS: [
    ["ACTIVO", "Activos"],
    ["CERRADO", "Cerrados"],
    ["CANCELADO", "Cancelados"],
    ["TODOS", "Todos los estados"],
  ],
};
const field =
  "mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100";

export default function HeatmapPage() {
  const [filters, setFilters] = useState<HeatmapFilters>({
    tipo: "ALERTAS",
    estado: "ACTIVA",
  });
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [validation, setValidation] = useState("");
  const load = useCallback(
    (signal: AbortSignal) => getHeatmap(filters, signal),
    [filters],
  );
  const { data, error, loading, reload } = useApiResource(load);
  const apply = (event: FormEvent) => {
    event.preventDefault();
    if (desde && hasta && desde > hasta) {
      setValidation("La fecha inicial no puede ser posterior a la final.");
      return;
    }
    setValidation("");
    setFilters((current) => ({
      ...current,
      desde: desde || undefined,
      hasta: hasta || undefined,
    }));
  };
  const changeType = (tipo: HeatmapType) =>
    setFilters((current) => ({
      ...current,
      tipo,
      estado: tipo === "ALERTAS" ? "ACTIVA" : "ACTIVO",
    }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Analítica de la comunidad</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Mapa de calor
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Explora dónde se concentran las alertas de extravío y los
            avistamientos.
          </p>
        </div>
        <Button variant="outline" onClick={reload} disabled={loading}>
          <RefreshCw size={16} className="mr-2" />
          Actualizar datos
        </Button>
      </header>
      <section
        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        aria-label="Filtros del mapa"
      >
        <div
          className="mb-5 flex flex-wrap gap-2"
          role="group"
          aria-label="Tipo de reporte"
        >
          <Button
            variant={filters.tipo === "ALERTAS" ? "primary" : "outline"}
            aria-pressed={filters.tipo === "ALERTAS"}
            onClick={() => changeType("ALERTAS")}
          >
            Alertas de extravío
          </Button>
          <Button
            variant={filters.tipo === "AVISTAMIENTOS" ? "primary" : "outline"}
            aria-pressed={filters.tipo === "AVISTAMIENTOS"}
            onClick={() => changeType("AVISTAMIENTOS")}
          >
            Avistamientos
          </Button>
        </div>
        <form
          onSubmit={apply}
          className="grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <label className="text-sm font-medium text-slate-600">
            Estado
            <select
              aria-label="Estado"
              className={field}
              value={filters.estado}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  estado: event.target.value,
                }))
              }
            >
              {states[filters.tipo].map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            Desde
            <input
              aria-label="Desde"
              className={field}
              type="date"
              min="1000-01-01"
              max={hasta || "9999-12-31"}
              value={desde}
              onChange={(event) => setDesde(event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-slate-600">
            Hasta
            <input
              aria-label="Hasta"
              className={field}
              type="date"
              min={desde || "1000-01-01"}
              max="9999-12-31"
              value={hasta}
              onChange={(event) => setHasta(event.target.value)}
            />
          </label>
          <Button type="submit" className="min-h-11">
            Aplicar fechas
          </Button>
          {validation && (
            <p
              className="text-sm text-red-700 sm:col-span-2 xl:col-span-4"
              role="alert"
            >
              {validation}
            </p>
          )}
        </form>
        <p className="mt-3 text-xs text-slate-500">
          Fechas del extravío o avistamiento, inclusive, en horario de Bolivia.
          Sin fechas se consulta todo el período.
        </p>
      </section>
      <section
        className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6"
        aria-label="Resultados del mapa"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <MapPinned size={22} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">
                {filters.tipo === "ALERTAS"
                  ? "Alertas de extravío"
                  : "Avistamientos"}
              </h2>
              <p className="mt-1 text-sm text-slate-500" aria-live="polite">
                {loading
                  ? "Consultando reportes…"
                  : data
                    ? `${data.totalReportes.toLocaleString("es-BO")} reportes · ${data.datos.features.length.toLocaleString("es-BO")} zonas`
                    : "Datos no disponibles"}
              </p>
            </div>
          </div>
          <div className="min-w-40 text-xs text-slate-500">
            <div className="mb-1.5 h-2 rounded-full bg-gradient-to-r from-sky-400 via-yellow-300 to-rose-600" />
            <div className="flex justify-between gap-5">
              <span>Menor concentración</span>
              <span>Mayor</span>
            </div>
          </div>
        </div>
        {loading && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600"
          >
            Cargando reportes…
          </p>
        )}
        {error && (
          <div
            role="alert"
            className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <Button variant="outline" onClick={reload}>
              Reintentar
            </Button>
          </div>
        )}
        {data?.totalReportes === 0 && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            No hay reportes para los filtros seleccionados. Prueba otro estado o
            intervalo de fechas.
          </p>
        )}
        <HeatmapMap data={data?.datos ?? EMPTY_HEATMAP} />
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
          La escala de color es relativa a esta consulta. Cada reporte cuenta
          por igual; varios reportes pueden corresponder a la misma mascota. Las
          ubicaciones se agrupan y son aproximadas. Los colores no representan
          niveles de riesgo.
        </p>
      </section>
    </div>
  );
}
