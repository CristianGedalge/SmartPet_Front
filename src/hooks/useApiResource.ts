import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../utils/error.utils';
export function useApiResource<T>(load:(signal:AbortSignal) => Promise<T>) {
  const [attempt,setAttempt] = useState(0);
  const [result,setResult] = useState<{load:typeof load;attempt:number;data?:T;error?:string}>();
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal).then(data => {if(!controller.signal.aborted) setResult({load,attempt,data});})
      .catch((error:unknown) => {if(!controller.signal.aborted) setResult({load,attempt,error:getApiErrorMessage(error,'No pudimos cargar los datos. Revisa tu conexión y reintenta.')});});
    return () => controller.abort();
  },[load,attempt]);
  const reload = useCallback(() => setAttempt(value => value+1),[]);
  const current = result?.load === load && result.attempt === attempt ? result : undefined;
  return {loading:!current,data:current?.data,error:current?.error,reload};
}
