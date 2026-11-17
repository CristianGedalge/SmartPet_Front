import { apiClient } from '../../../api/axios.instance';
import { ENDPOINTS } from '../../../api/endpoints';
import type { Establecimiento, UpdateEstablishmentInput } from '../../../types';
export const establishmentsService = {
  async list(limit: number, offset: number, signal?: AbortSignal) {
    const { data } = await apiClient.get<Establecimiento[]>(ENDPOINTS.ESTABLECIMIENTOS.BASE, { params: { limit, offset }, signal });
    return data;
  },
  async get(id: string, signal?: AbortSignal) {
    const { data } = await apiClient.get<Establecimiento>(ENDPOINTS.ESTABLECIMIENTOS.BY_ID(id), { signal });
    return data;
  },
  async update(id: string, payload: UpdateEstablishmentInput) {
    await apiClient.patch(ENDPOINTS.ESTABLECIMIENTOS.BY_ID(id), payload);
  },
  async deactivate(id: string) { await apiClient.delete(ENDPOINTS.ESTABLECIMIENTOS.BY_ID(id)); },
};

