export interface LocationCoordinates {
  latitud: number;
  longitud: number;
}

export function isValidLocation(location: LocationCoordinates): boolean {
  return Number.isFinite(location.latitud) && Number.isFinite(location.longitud)
    && Math.abs(location.latitud) <= 90 && Math.abs(location.longitud) <= 180;
}
