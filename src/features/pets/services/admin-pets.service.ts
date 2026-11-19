import { apiClient } from '../../../api/axios.instance';
import { ENDPOINTS } from '../../../api/endpoints';
import type {
  AdminPetRecord,
  AdminUpdatePetInput,
  Species,
} from '../types/pet.types';

export const adminPetsService = {
  async list(limit: number, offset: number, signal?: AbortSignal) {
    const { data } = await apiClient.get<AdminPetRecord[]>(
      ENDPOINTS.MASCOTAS.BASE,
      { params: { limit, offset }, signal },
    );
    return data;
  },

  async get(id: string, signal?: AbortSignal) {
    const { data } = await apiClient.get<AdminPetRecord>(
      ENDPOINTS.MASCOTAS.BY_ID(id),
      { signal },
    );
    return data;
  },

  async update(id: string, payload: AdminUpdatePetInput) {
    await apiClient.patch(ENDPOINTS.MASCOTAS.BY_ID(id), payload);
  },

  async deactivate(id: string) {
    await apiClient.delete(ENDPOINTS.MASCOTAS.BY_ID(id));
  },

  async species(signal?: AbortSignal) {
    const { data } = await apiClient.get<Species[]>(ENDPOINTS.ESPECIES.LIST, {
      signal,
    });
    return data;
  },
};
