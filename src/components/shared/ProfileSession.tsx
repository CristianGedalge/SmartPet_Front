import { useEffect, useState, type ReactNode } from 'react';
import { authService } from '../../features/auth/services/auth.service';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/auth.store';
import { getApiErrorMessage } from '../../utils/error.utils';
import { Button } from '../ui/button';

export function ProfileSession({ children }: { children: ReactNode }) {
  const { token, updateUser } = useAuth();
  const [attempt, setAttempt] = useState(0);
  const key = token + ':' + attempt;
  const [result, setResult] = useState<{ key: string; error: string | null }>({ key: '', error: null });
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    void authService.getProfile(controller.signal).then((profile) => {
      if (controller.signal.aborted || useAuthStore.getState().token !== token) return;
      updateUser(profile);
      setResult({ key, error: null });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted && useAuthStore.getState().token === token) setResult({ key, error: getApiErrorMessage(error, 'No pudimos validar tu sesión. Comprueba que la API esté disponible.') });
    });
    return () => controller.abort();
  }, [token, updateUser, key]);
  if (result.key !== key) return <div className="api-loading" role="status">Cargando tu cuenta…</div>;
  if (result.error) return <section className="panel api-error" role="alert"><p>{result.error}</p><Button variant="outline" onClick={() => setAttempt((value) => value + 1)}>Reintentar</Button></section>;
  return children;
}

