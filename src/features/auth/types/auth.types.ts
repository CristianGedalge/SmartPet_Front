import type { AuthUser, TipoEstablecimiento } from '../../../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterEstablecimientoInput {
  nombre: string;
  tipo: TipoEstablecimiento;
  direccion: string;
  latitud?: number;
  longitud?: number;
  telefono: string;
  horarioAtencion?: string;
  descripcion?: string;
}

export interface RegisterEncargadoPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  establecimiento: RegisterEstablecimientoInput;
}

export interface AuthResponse {
  access_token: string;
  usuario: AuthUser;
}
