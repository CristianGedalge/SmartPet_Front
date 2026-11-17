import { AdminDirectory, type DirectoryConfig } from '../../../components/shared/AdminDirectory';
import { establishmentFields, establishmentForm } from '../forms/establishment.form';
import type { Establecimiento } from '../../../types';
import { establishmentPayload } from '../../../utils/form.utils';
import { establishmentsService } from '../services/establishments.service';

const config: DirectoryConfig<Establecimiento> = {
  title: 'Establecimientos', description: 'Veterinarias y refugios que forman parte de nuestra comunidad.', singular: 'establecimiento',
  label: (item) => item.nombre,
  searchText: (item) => [item.nombre, item.tipo, item.direccion, item.usuario?.nombre, item.usuario?.apellido].join(' '),
  columns: [
    { title: 'Establecimiento', render: (item) => <div className="directory-person"><strong>{item.nombre}</strong><small>{item.direccion}</small></div> },
    { title: 'Tipo', render: (item) => item.tipo === 'REFUGIO' ? 'Refugio / Albergue' : 'Veterinaria' },
    { title: 'Encargado', render: (item) => item.usuario ? item.usuario.nombre + ' ' + item.usuario.apellido : '—' },
    { title: 'Teléfono', render: (item) => item.telefono },
  ],
  fields: establishmentFields, toForm: establishmentForm,
  list: establishmentsService.list, get: establishmentsService.get,
  save: (id, values) => establishmentsService.update(id, establishmentPayload(values)),
  setStatus: (item) => item.estado ? establishmentsService.deactivate(item.id) : establishmentsService.update(item.id, { estado: true }),
  details: (item) => <div className="api-detail-info">{item.usuario && <p><strong>Encargado:</strong> {item.usuario.nombre} {item.usuario.apellido} · {item.usuario.email}</p>}{item.latitud != null && item.longitud != null && <a href={'https://www.openstreetmap.org/?mlat=' + Number(item.latitud) + '&mlon=' + Number(item.longitud) + '#map=17/' + Number(item.latitud) + '/' + Number(item.longitud)} target="_blank" rel="noreferrer">Ver ubicación en el mapa ↗</a>}</div>,
  filter: { label: 'Tipo en esta página', value: (item) => item.tipo, options: [{ value: 'VETERINARIA', label: 'Veterinaria' }, { value: 'REFUGIO', label: 'Refugio / Albergue' }] },
};
export default function AdminEstablishmentsPage() { return <AdminDirectory config={config} />; }

