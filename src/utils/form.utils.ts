import type { UpdateEstablishmentInput } from '../types';
export type FormValues = Record<string, string>;

export function establishmentPayload(values: FormValues): UpdateEstablishmentInput {
  const hasLatitude = values.latitud.trim() !== '';
  const hasLongitude = values.longitud.trim() !== '';
  if (hasLatitude !== hasLongitude) throw new Error('Vuelve a marcar la ubicación del establecimiento en el mapa.');
  const coordinates = hasLatitude ? { latitud: Number(values.latitud), longitud: Number(values.longitud) } : {};
  if (hasLatitude && (!Number.isFinite(coordinates.latitud) || !Number.isFinite(coordinates.longitud) || Math.abs(coordinates.latitud!) > 90 || Math.abs(coordinates.longitud!) > 180)) throw new Error('La ubicación no es válida. Vuelve a marcar el punto en el mapa.');
  return { nombre: values.nombre.trim(), tipo: values.tipo as 'VETERINARIA' | 'REFUGIO', direccion: values.direccion.trim(), telefono: values.telefono.trim(), descripcion: values.descripcion.trim(), horarioAtencion: values.horarioAtencion.trim(), ...coordinates };
}
export function formError(error: unknown, fallback: string) {
  return error instanceof Error && !('isAxiosError' in error) ? error.message : fallback;
}

