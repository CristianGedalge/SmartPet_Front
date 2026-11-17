import { apiClient } from '../../../api/axios.instance';
import { ENDPOINTS } from '../../../api/endpoints';
import type { AuthUser, UpdateProfileInput } from '../../../types';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterEncargadoPayload,
} from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    return data;
  },

  async registerEncargado(
    payload: RegisterEncargadoPayload,
  ): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      payload,
    );
    return data;
  },

  async getProfile(signal?: AbortSignal): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>(ENDPOINTS.AUTH.PROFILE, { signal });
    return data;
  },

  async updateProfile(payload: UpdateProfileInput): Promise<AuthUser> {
    const { data } = await apiClient.patch<AuthUser>(ENDPOINTS.AUTH.PROFILE, payload);
    return data;
  },
};
