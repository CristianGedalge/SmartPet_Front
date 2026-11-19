import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import type { Plan } from '../../../types';
import { getApiErrorMessage } from '../../../utils/error.utils';
import { plansService } from '../services/plans.service';

interface Draft {
  nombre: string;
  descripcion: string;
  precioReferencial: string;
  busquedasFotoMes: string;
  mensajesAgenteMes: string;
  activo: boolean;
}

const emptyDraft: Draft = {
  nombre: '',
  descripcion: '',
  precioReferencial: '0',
  busquedasFotoMes: '',
  mensajesAgenteMes: '',
  activo: true,
};

function limit(value: string) {
  return value.trim() === '' ? null : Number(value);
}

function fromPlan(plan: Plan): Draft {
  return {
    nombre: plan.nombre,
    descripcion: plan.descripcion ?? '',
    precioReferencial: String(plan.precioReferencial),
    busquedasFotoMes: plan.busquedasFotoMes === null ? '' : String(plan.busquedasFotoMes),
    mensajesAgenteMes: plan.mensajesAgenteMes === null ? '' : String(plan.mensajesAgenteMes),
    activo: plan.activo,
  };
}

function cupo(value: number | null) {
  return value === null ? 'Sin tope' : String(value);
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void plansService.list(controller.signal).then((loaded) => {
      if (!controller.signal.aborted) setPlans(loaded);
    }).catch((reason: unknown) => {
      if (!controller.signal.aborted) setError(getApiErrorMessage(reason, 'No se pudieron cargar los planes.'));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [attempt]);

  function change(field: keyof Draft, value: string | boolean) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function save() {
    const price = Number(draft.precioReferencial);
    const searches = limit(draft.busquedasFotoMes);
    const messages = limit(draft.mensajesAgenteMes);
    if (draft.nombre.trim().length < 2) {
      setError('El nombre del plan necesita al menos 2 caracteres.');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError('El precio de referencia no puede ser negativo.');
      return;
    }
    if ((searches !== null && (!Number.isInteger(searches) || searches < 0))
      || (messages !== null && (!Number.isInteger(messages) || messages < 0))) {
      setError('Los cupos deben ser números enteros. Déjalos vacíos si el plan no tiene tope.');
      return;
    }
    setBusy(true);
    setError(null);
    void plansService.save({
      nombre: draft.nombre.trim(),
      descripcion: draft.descripcion.trim() || null,
      precioReferencial: price,
      busquedasFotoMes: searches,
      mensajesAgenteMes: messages,
      activo: draft.activo,
    }, editing ?? undefined).then(() => {
      setDraft(emptyDraft);
      setEditing(null);
      setAttempt((value) => value + 1);
    }).catch((reason: unknown) => {
      setError(getApiErrorMessage(reason, 'No se pudo guardar el plan.'));
    }).finally(() => setBusy(false));
  }

  return (
    <section className="directory-page">
      <div className="dashboard-intro">
        <div>
          <h1>Planes</h1>
          <p>El ciudadano paga este precio en la app y el plan queda activo 30 días. Un cupo vacío significa que ese uso no tiene tope mensual. Cero lo deja fuera del plan.</p>
        </div>
      </div>
      <form className="api-form-grid" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <label className="api-field">Nombre
          <input value={draft.nombre} maxLength={50} onChange={(event) => change('nombre', event.target.value)} />
        </label>
        <label className="api-field">Precio de referencia
          <input type="number" min="0" step="0.01" value={draft.precioReferencial} onChange={(event) => change('precioReferencial', event.target.value)} />
        </label>
        <label className="api-field">Búsquedas por foto al mes
          <input type="number" min="0" step="1" value={draft.busquedasFotoMes} onChange={(event) => change('busquedasFotoMes', event.target.value)} />
        </label>
        <label className="api-field">Mensajes del agente al mes
          <input type="number" min="0" step="1" value={draft.mensajesAgenteMes} onChange={(event) => change('mensajesAgenteMes', event.target.value)} />
        </label>
        <label className="api-field api-field-wide">Descripción
          <textarea maxLength={500} value={draft.descripcion} onChange={(event) => change('descripcion', event.target.value)} />
        </label>
        <label className="api-field">
          <span>Disponible para asignar</span>
          <input type="checkbox" checked={draft.activo} onChange={(event) => change('activo', event.target.checked)} />
        </label>
        <div className="api-modal-actions">
          <Button type="button" variant="outline" disabled={busy} onClick={() => { setEditing(null); setDraft(emptyDraft); }}>Limpiar</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear plan'}</Button>
        </div>
      </form>
      {error && <p className="api-feedback error" role="alert">{error}</p>}
      {loading ? <p className="api-loading" role="status">Cargando planes…</p> : (
        <div className="directory-table-scroll">
          <table className="directory-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Precio</th>
                <th>Búsquedas</th>
                <th>Agente</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td><strong>{plan.nombre}</strong><br />{plan.descripcion}</td>
                  <td>{plan.precioReferencial.toFixed(2)}</td>
                  <td>{cupo(plan.busquedasFotoMes)}</td>
                  <td>{cupo(plan.mensajesAgenteMes)}</td>
                  <td>{plan.activo ? 'Activo' : 'Inactivo'}</td>
                  <td><Button type="button" variant="outline" onClick={() => { setEditing(plan.id); setDraft(fromPlan(plan)); setError(null); }}>Editar</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
