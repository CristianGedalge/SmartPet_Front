import { useState, type FormEvent } from 'react';
import { ShieldCheck, Save } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthStore } from '../../../stores/auth.store';
import { UserAvatar } from '../../../components/shared/UserAvatar';
import { DirectoryFields, type DirectoryField } from '../../../components/shared/DirectoryFields';
import { Button } from '../../../components/ui/button';
import { authService } from '../../auth/services/auth.service';
import { establishmentFields, establishmentForm } from '../../establishments/forms/establishment.form';
import { establishmentPayload, formError, type FormValues } from '../../../utils/form.utils';
import { getApiErrorMessage } from '../../../utils/error.utils';

const personalFields: DirectoryField[] = [
  { name: 'nombre', label: 'Nombre', required: true, maxLength: 100 },
  { name: 'apellido', label: 'Apellido', required: true, maxLength: 100 },
  { name: 'telefono', label: 'Teléfono', maxLength: 20 },
  { name: 'fotoUrl', label: 'URL de tu foto de perfil', type: 'url' },
];
const passwordFields: DirectoryField[] = [
  { name: 'password', label: 'Nueva contraseña', type: 'password', minLength: 8, maxLength: 72 },
  { name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', minLength: 8, maxLength: 72 },
];

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const [values, setValues] = useState(() => ({ nombre: user?.nombre ?? '', apellido: user?.apellido ?? '', telefono: user?.telefono ?? '', fotoUrl: user?.fotoUrl ?? '' }));
  const [institution, setInstitution] = useState<FormValues | null>(() => user?.establecimiento ? establishmentForm(user.establecimiento) : null);
  const [password, setPassword] = useState({ password: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ error: boolean; text: string } | null>(null);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFeedback(null);
    if (password.password !== password.confirmPassword) { setFeedback({ error: true, text: 'Las contraseñas no coinciden.' }); return; }
    setBusy(true);
    try {
      const profile = await authService.updateProfile({
        nombre: values.nombre.trim(), apellido: values.apellido.trim(), telefono: values.telefono.trim(), fotoUrl: values.fotoUrl.trim(),
        ...(password.password ? { password: password.password } : {}),
        ...(user?.rol === 'ENCARGADO' && institution ? { establecimiento: establishmentPayload(institution) } : {}),
      });
      if (useAuthStore.getState().token !== token) return;
      updateUser(profile);
      setValues({ nombre: profile.nombre, apellido: profile.apellido, telefono: profile.telefono ?? '', fotoUrl: profile.fotoUrl ?? '' });
      setInstitution(profile.establecimiento ? establishmentForm(profile.establecimiento) : null);
      setPassword({ password: '', confirmPassword: '' });
      setFeedback({ error: false, text: 'Tu perfil se actualizó correctamente.' });
    } catch (error: unknown) {
      setFeedback({ error: true, text: formError(error, getApiErrorMessage(error, 'No pudimos guardar tu perfil. Inténtalo nuevamente.')) });
    } finally { setBusy(false); }
  }
  return <div className="module-page">
    <div className="dashboard-intro"><div><p className="eyebrow">TU ESPACIO PERSONAL</p><h1>Mi perfil</h1><p>Actualiza tus datos y mantente cerca de tu comunidad.</p></div></div>
    <section className="panel profile-card"><div className="profile-cover" /><div className="profile-identity"><UserAvatar /><h2>{user?.nombre} {user?.apellido}</h2><span><ShieldCheck size={14} />{user?.rol === 'ADMIN' ? 'Administrador' : 'Encargado'}</span><p className="profile-email">{user?.email}</p></div>
      <form className="profile-edit-form" onSubmit={(event) => { void save(event); }}>
        <fieldset disabled={busy}><legend>Información personal</legend><DirectoryFields fields={personalFields} values={values} onChange={(next) => setValues({ nombre: next.nombre, apellido: next.apellido, telefono: next.telefono, fotoUrl: next.fotoUrl })} />
          {user?.rol === 'ENCARGADO' && institution && <div className="profile-form-section"><h3>Mi establecimiento</h3><DirectoryFields disabled={busy} fields={establishmentFields} values={institution} onChange={(next) => setInstitution({ nombre: next.nombre, tipo: next.tipo, direccion: next.direccion, telefono: next.telefono, horarioAtencion: next.horarioAtencion, descripcion: next.descripcion, latitud: next.latitud, longitud: next.longitud })} /></div>}
          <div className="profile-form-section"><h3>Cambiar contraseña</h3><p className="api-muted">Deja ambos campos vacíos para conservar tu contraseña actual.</p><DirectoryFields fields={passwordFields} values={password} onChange={(next) => setPassword({ password: next.password, confirmPassword: next.confirmPassword })} /></div>
        </fieldset>
        {feedback && <p className={'api-feedback ' + (feedback.error ? 'error' : 'success')} role={feedback.error ? 'alert' : 'status'}>{feedback.text}</p>}
        <div className="profile-save"><Button type="submit" disabled={busy}><Save size={16} />{busy ? 'Guardando…' : 'Guardar cambios'}</Button></div>
      </form>
    </section>
  </div>;
}

