import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../utils/error.utils';
const PAGE_SIZE = 10;

export function usePaginatedList<T>(load: (limit: number, offset: number, signal: AbortSignal) => Promise<T[]>) {
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const key = page + ':' + revision;
  const [result, setResult] = useState<{ key: string; items: T[]; hasNext: boolean; error: string | null }>({ key: '', items: [], hasNext: false, error: null });
  useEffect(() => {
    const controller = new AbortController();
    void load(PAGE_SIZE + 1, page * PAGE_SIZE, controller.signal).then((items) => {
      if (!controller.signal.aborted) setResult({ key, items: items.slice(0, PAGE_SIZE), hasNext: items.length > PAGE_SIZE, error: null });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResult({ key, items: [], hasNext: false, error: getApiErrorMessage(error, 'No pudimos cargar los registros. Comprueba tu conexión e inténtalo de nuevo.') });
    });
    return () => controller.abort();
  }, [load, page, key]);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  return { page, setPage, refresh, loading: result.key !== key, items: result.key === key ? result.items : [], hasNext: result.key === key && result.hasNext, error: result.key === key ? result.error : null };
}

