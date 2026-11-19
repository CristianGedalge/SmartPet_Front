import { apiClient } from '../../../api/axios.instance';
import { ENDPOINTS } from '../../../api/endpoints';
import type {
  Plan,
  PlanInput,
  SuscripcionCiudadano,
} from '../../../types';

export const plansService = {
  async list(signal?: AbortSignal) {
    const { data } = await apiClient.get<Plan[]>(ENDPOINTS.PLANES.BASE, { signal });
    return data;
  },
  async save(values: PlanInput, id?: string) {
    if (id) {
      const { data } = await apiClient.patch<Plan>(ENDPOINTS.PLANES.BY_ID(id), values);
      return data;
    }
    const { data } = await apiClient.post<Plan>(ENDPOINTS.PLANES.BASE, values);
    return data;
  },
  async ofUser(userId: string, signal?: AbortSignal) {
    const { data } = await apiClient.get<SuscripcionCiudadano | null>(
      ENDPOINTS.SUSCRIPCIONES.BY_USER(userId),
      { signal },
    );
    return data;
  },
};
