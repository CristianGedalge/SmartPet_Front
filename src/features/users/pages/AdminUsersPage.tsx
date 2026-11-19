import { CitizenSubscription } from '../../subscriptions/components/CitizenSubscription';
import { AdminDirectory, type DirectoryConfig } from '../../../components/shared/AdminDirectory';
import type { AuthUser } from '../../../types';
import { usersService } from '../services/users.service';

const config: DirectoryConfig<AuthUser> = {
  title: 'Nuestra comunidad', description: 'Consulta las cuentas registradas y administra sus datos y estado.', singular: 'usuario',
  label: (user) => user.nombre + ' ' + user.apellido,
  searchText: (user) => [user.nombre, user.apellido, user.email, user.rol, user.establecimiento?.nombre].join(' '),
  columns: [
    { title: 'Usuario', render: (user) => <div className="directory-person"><strong>{user.nombre} {user.apellido}</strong><small>{user.email}</small></div> },
    { title: 'Rol', render: (user) => user.rol === 'ADMIN' ? 'Administrador' : user.rol === 'ENCARGADO' ? 'Encargado' : 'Ciudadano' },
    { title: 'Teléfono', render: (user) => user.telefono || '—' },
    { title: 'Establecimiento', render: (user) => user.establecimiento?.nombre ?? '—' },
  ],
  fields: [
    { name: 'nombre', label: 'Nombre', required: true, maxLength: 100 },
    { name: 'apellido', label: 'Apellido', required: true, maxLength: 100 },
    { name: 'telefono', label: 'Teléfono', maxLength: 20 },
    { name: 'fotoUrl', label: 'URL de foto de perfil', type: 'url' },
  ],
  toForm: (user) => ({ nombre: user.nombre, apellido: user.apellido, telefono: user.telefono ?? '', fotoUrl: user.fotoUrl ?? '' }),
  list: usersService.list, get: usersService.get,
  save: (id, values) => usersService.update(id, { nombre: values.nombre.trim(), apellido: values.apellido.trim(), telefono: values.telefono.trim(), fotoUrl: values.fotoUrl.trim() }),
  setStatus: (user) => user.estado ? usersService.deactivate(user.id) : usersService.update(user.id, { estado: true }),
  details: (user) => <div><div className="api-detail-info"><p><strong>Correo:</strong> {user.email}</p><p><strong>Rol:</strong> {user.rol}</p>{user.establecimiento && <p><strong>Establecimiento:</strong> {user.establecimiento.nombre}</p>}</div><CitizenSubscription userId={user.id} role={user.rol} /></div>,
  filter: { label: 'Rol en esta página', value: (user) => user.rol, load: async (signal) => (await usersService.roles(signal)).map((role) => ({ value: role.nombre, label: role.nombre === 'ADMIN' ? 'Administrador' : role.nombre === 'ENCARGADO' ? 'Encargado' : 'Ciudadano' })) },
};
export default function AdminUsersPage() { return <AdminDirectory config={config} />; }

