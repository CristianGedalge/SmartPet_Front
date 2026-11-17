import type { DirectoryField } from '../../../components/shared/DirectoryFields';
import type { Establecimiento } from '../../../types';

export const establishmentFields: DirectoryField[] = [
  { name: 'nombre', label: 'Nombre del establecimiento', required: true, maxLength: 150 },
  { name: 'tipo', label: 'Tipo', type: 'select', options: [{ value: 'VETERINARIA', label: 'Veterinaria' }, { value: 'REFUGIO', label: 'Refugio / Albergue' }] },
  { name: 'direccion', label: 'Dirección', required: true, maxLength: 255, wide: true },
  { name: 'telefono', label: 'Teléfono de contacto', required: true, maxLength: 20 },
  { name: 'horarioAtencion', label: 'Horario de atención', maxLength: 150 },
  { name: 'ubicacion', label: 'Ubicación del establecimiento', type: 'location', wide: true },
  { name: 'descripcion', label: 'Descripción', type: 'textarea', wide: true },
];
export function establishmentForm(item: Establecimiento) {
  return { nombre: item.nombre, tipo: item.tipo, direccion: item.direccion, telefono: item.telefono, horarioAtencion: item.horarioAtencion ?? '', descripcion: item.descripcion ?? '', latitud: item.latitud == null ? '' : String(item.latitud), longitud: item.longitud == null ? '' : String(item.longitud) };
}
