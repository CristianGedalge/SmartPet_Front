import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import type { SuscripcionCiudadano } from '../../../types';
import { getApiErrorMessage } from '../../../utils/error.utils';
import { plansService } from '../services/plans.service';

function cupo(used: number, limit: number | null) {
  return limit === null ? `${used} usadas, sin tope` : `${used} de ${limit}`;
}

export function CitizenSubscription({ userId, role }: { userId: string; role: string }) {
  const [current, setCurrent] = useState<SuscripcionCiudadano | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (role !== 'CIUDADANO') return;
    const controller = new AbortController();
    void plansService.ofUser(userId, controller.signal).then((subscription) => {
      if (controller.signal.aborted) return;
      setCurrent(subscription);
    }).catch((reason: unknown) => {
      if (!controller.signal.aborted) setError(getApiErrorMessage(reason, 'No se pudo cargar la suscripción.'));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [role, userId, attempt]);

  if (role !== 'CIUDADANO') return null;

  return (
    <div className="api-detail-info">
      <p><strong>Suscripción:</strong> {loading ? 'Cargando…' : current ? `${current.plan} · ${current.estado}` : 'Sin suscripción'}</p>
      {current && (
        <>
          <p>Búsquedas por foto: {cupo(current.busquedasFotoUsadas, current.busquedasFotoMes)}</p>
          <p>Agente: {cupo(current.mensajesAgenteUsados, current.mensajesAgenteMes)}</p>
          <p>Vencimiento: {current.fin ? new Date(current.fin).toLocaleDateString('es-BO') : 'Sin fecha'}</p>
        </>
      )}
      {error && <p className="api-feedback error" role="alert">{error}</p>}
      <div className="api-modal-actions">
        <Button type="button" variant="outline" disabled={loading} onClick={() => {
          setLoading(true);
          setError(null);
          setAttempt((value) => value + 1);
        }}>Actualizar</Button>
      </div>
    </div>
  );
}
