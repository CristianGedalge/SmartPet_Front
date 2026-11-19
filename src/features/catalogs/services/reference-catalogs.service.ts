import { apiClient } from '../../../api/axios.instance';
import { ENDPOINTS } from '../../../api/endpoints';
import type { ReferenceCatalogItem } from '../types/catalog.types';

async function list(url: string, signal?: AbortSignal) {
  const { data } = await apiClient.get<ReferenceCatalogItem[]>(url, { signal });
  return data;
}

export const referenceCatalogsService = {
  roles: (signal?: AbortSignal) => list(ENDPOINTS.ROLES.LIST, signal),
  species: (signal?: AbortSignal) => list(ENDPOINTS.ESPECIES.LIST, signal),
};

