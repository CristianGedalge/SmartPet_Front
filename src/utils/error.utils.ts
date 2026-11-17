import axios from 'axios';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado',
): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const msg = error.response?.data?.message;
    if (Array.isArray(msg)) {
      return msg[0] ?? fallback;
    }
    if (typeof msg === 'string') {
      return msg;
    }
  }
  return fallback;
}
