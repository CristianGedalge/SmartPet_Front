import {
  AdminDirectory,
  type DirectoryConfig,
} from '../../../components/shared/AdminDirectory';
import type { FormValues } from '../../../utils/form.utils';
import { AnimalImage } from '../components/AnimalImage';
import { adminPetsService } from '../services/admin-pets.service';
import type { AdminPetRecord, AdminUpdatePetInput } from '../types/pet.types';

function formatSex(sexo: AdminPetRecord['sexo']) {
  if (sexo === 'MACHO') return 'Macho';
  if (sexo === 'HEMBRA') return 'Hembra';
  if (sexo === 'DESCONOCIDO') return 'Desconocido';
  return '—';
}

function formatAge(months: number | null) {
  if (months == null) return '—';
  if (months < 12) return `${months} mes${months === 1 ? '' : 'es'}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem
    ? `${years} año${years === 1 ? '' : 's'} y ${rem} m`
    : `${years} año${years === 1 ? '' : 's'}`;
}

function buildUpdatePayload(values: FormValues): AdminUpdatePetInput {
  const nombre = values.nombre.trim();
  if (!nombre) {
    throw new Error('El nombre de la mascota es obligatorio.');
  }

  const pesoStr = values.pesoKg.trim();
  let pesoKg: number | null = null;
  if (pesoStr !== '') {
    pesoKg = Number(pesoStr);
    if (!Number.isFinite(pesoKg) || pesoKg <= 0 || pesoKg > 9999.99) {
      throw new Error('El peso debe estar entre 0.01 y 9999.99 kg.');
    }
  }

  const edadStr = values.edadAproximadaMeses.trim();
  let edadAproximadaMeses: number | null = null;
  if (edadStr !== '') {
    edadAproximadaMeses = Number(edadStr);
    if (
      !Number.isInteger(edadAproximadaMeses) ||
      edadAproximadaMeses < 0
    ) {
      throw new Error('La edad en meses debe ser un número entero mayor o igual a 0.');
    }
  }

  const sexoVal = values.sexo.trim();
  const sexo =
    sexoVal === 'MACHO' || sexoVal === 'HEMBRA' || sexoVal === 'DESCONOCIDO'
      ? sexoVal
      : null;

  return {
    nombre,
    razaNombre: values.razaNombre.trim() || null,
    sexo,
    color: values.color.trim() || null,
    pesoKg,
    edadAproximadaMeses,
  };
}

const config: DirectoryConfig<AdminPetRecord> = {
  title: 'Mascotas de la comunidad',
  description:
    'Consulta todas las mascotas registradas, edita su información o gestiona su baja lógica.',
  singular: 'mascota',
  label: (pet) => pet.nombre,
  searchText: (pet) =>
    [
      pet.nombre,
      pet.especie?.nombre,
      pet.razaNombre,
      pet.color,
      pet.sexo,
      pet.usuario?.nombre,
      pet.usuario?.apellido,
      pet.usuario?.email,
    ].join(' '),
  columns: [
    {
      title: 'Mascota',
      render: (pet) => (
        <div className="directory-person">
          <strong>{pet.nombre}</strong>
          <small>{pet.razaNombre || 'Sin raza especificada'}</small>
        </div>
      ),
    },
    {
      title: 'Especie / Sexo',
      render: (pet) => (
        <div className="directory-person">
          <strong>{pet.especie?.nombre ?? '—'}</strong>
          <small>
            {formatSex(pet.sexo)}
            {pet.color ? ` · ${pet.color}` : ''}
          </small>
        </div>
      ),
    },
    {
      title: 'Edad / Peso',
      render: (pet) => (
        <div className="directory-person">
          <strong>{formatAge(pet.edadAproximadaMeses)}</strong>
          <small>{pet.pesoKg != null ? `${pet.pesoKg} kg` : '—'}</small>
        </div>
      ),
    },
    {
      title: 'Responsable',
      render: (pet) =>
        pet.usuario ? (
          <div className="directory-person">
            <strong>
              {pet.usuario.nombre} {pet.usuario.apellido}
            </strong>
            <small>{pet.usuario.email}</small>
          </div>
        ) : (
          '—'
        ),
    },
  ],
  fields: [
    { name: 'nombre', label: 'Nombre', required: true, maxLength: 100 },
    { name: 'razaNombre', label: 'Raza', maxLength: 100 },
    {
      name: 'sexo',
      label: 'Sexo',
      type: 'select',
      options: [
        { value: '', label: 'Sin especificar' },
        { value: 'MACHO', label: 'Macho' },
        { value: 'HEMBRA', label: 'Hembra' },
        { value: 'DESCONOCIDO', label: 'Desconocido' },
      ],
    },
    { name: 'color', label: 'Color', maxLength: 100 },
    {
      name: 'pesoKg',
      label: 'Peso (kg)',
      type: 'number',
      min: 0.01,
      max: 9999.99,
    },
    {
      name: 'edadAproximadaMeses',
      label: 'Edad aproximada (meses)',
      type: 'number',
      min: 0,
    },
  ],
  toForm: (pet) => ({
    nombre: pet.nombre,
    razaNombre: pet.razaNombre ?? '',
    sexo: pet.sexo ?? '',
    color: pet.color ?? '',
    pesoKg: pet.pesoKg != null ? String(pet.pesoKg) : '',
    edadAproximadaMeses:
      pet.edadAproximadaMeses != null ? String(pet.edadAproximadaMeses) : '',
  }),
  list: adminPetsService.list,
  get: adminPetsService.get,
  save: (id, values) =>
    adminPetsService.update(id, buildUpdatePayload(values)),
  setStatus: (pet) =>
    pet.estado
      ? adminPetsService.deactivate(pet.id)
      : adminPetsService.update(pet.id, { estado: true }),
  details: (pet) => (
    <div>
      {pet.fotos.length > 0 && (
        <div style={{ marginBottom: '0.75rem', maxWidth: '180px' }}>
          <AnimalImage url={pet.fotos[0]?.url} name={pet.nombre} />
        </div>
      )}
      <div className="api-detail-info">
        <p>
          <strong>Especie:</strong> {pet.especie?.nombre ?? '—'}
        </p>
        {pet.usuario && (
          <p>
            <strong>Propietario / Responsable:</strong> {pet.usuario.nombre}{' '}
            {pet.usuario.apellido} ({pet.usuario.email}
            {pet.usuario.telefono ? ` · ${pet.usuario.telefono}` : ''})
          </p>
        )}
        <p>
          <strong>Fotografías registradas:</strong> {pet.fotos.length}
        </p>
      </div>
    </div>
  ),
  filter: {
    label: 'Especie en esta página',
    value: (pet) => pet.especie?.nombre ?? '',
    load: async (signal) =>
      (await adminPetsService.species(signal)).map((sp) => ({
        value: sp.nombre,
        label: sp.nombre,
      })),
  },
};

export default function AdminPetsPage() {
  return <AdminDirectory config={config} />;
}
