import { apiClient } from '../../../api/axios.instance';
import { ENDPOINTS } from '../../../api/endpoints';
import type { AuthUser, Role, UpdateUserInput } from '../../../types';

export const usersService = {
  async list(limit: number, offset: number, signal?: AbortSignal) {
    const { data } = await apiClient.get<AuthUser[]>(ENDPOINTS.USUARIOS.BASE, { params: { limit, offset }, signal });
    return data;
  },
  async get(id: string, signal?: AbortSignal) {
    const { data } = await apiClient.get<AuthUser>(ENDPOINTS.USUARIOS.BY_ID(id), { signal });
    return data;
  },
  async update(id: string, payload: UpdateUserInput) {
    await apiClient.patch(ENDPOINTS.USUARIOS.BY_ID(id), payload);
  },
  async deactivate(id: string) { await apiClient.delete(ENDPOINTS.USUARIOS.BY_ID(id)); },
  async roles(signal?: AbortSignal) {
    const { data } = await apiClient.get<Role[]>(ENDPOINTS.ROLES.LIST, { signal });
    return data;
  },
};

