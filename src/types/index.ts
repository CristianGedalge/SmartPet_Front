export type RolNombre = 'ADMIN' | 'ENCARGADO' | 'CIUDADANO';

export type TipoEstablecimiento = 'VETERINARIA' | 'REFUGIO';

export interface Establecimiento {
  id: string;
  usuarioId?: string;
  nombre: string;
  tipo: TipoEstablecimiento;
  descripcion: string | null;
  direccion: string;
  latitud: number | string | null;
  longitud: number | string | null;
  telefono: string;
  horarioAtencion: string | null;
  estado: boolean;
  usuario?: Omit<AuthUser, 'establecimiento'> | null;
}

export interface AuthUser {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  fotoUrl: string | null;
  email: string;
  rol: RolNombre;
  estado: boolean;
  establecimiento: Establecimiento | null;
  suscripcion?: SuscripcionCiudadano | null;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface Role { id: number; nombre: RolNombre; }

export interface Plan {
  id: string;
  nombre: string;
  descripcion: string | null;
  precioReferencial: number;
  busquedasFotoMes: number | null;
  mensajesAgenteMes: number | null;
  activo: boolean;
}

export interface SuscripcionCiudadano {
  plan: string;
  planId: string;
  estado: 'ACTIVA' | 'VENCIDA' | 'CANCELADA';
  inicio: string;
  fin: string | null;
  busquedasFotoMes: number | null;
  busquedasFotoUsadas: number;
  mensajesAgenteMes: number | null;
  mensajesAgenteUsados: number;
}

export interface PlanInput {
  nombre: string;
  descripcion?: string | null;
  precioReferencial: number;
  busquedasFotoMes: number | null;
  mensajesAgenteMes: number | null;
  activo?: boolean;
}

export interface UpdateUserInput {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  fotoUrl?: string;
  estado?: boolean;
}

export interface UpdateEstablishmentInput {
  nombre?: string;
  tipo?: TipoEstablecimiento;
  descripcion?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  telefono?: string;
  horarioAtencion?: string;
  estado?: boolean;
}

export interface UpdateProfileInput extends Omit<UpdateUserInput, 'estado'> {
  password?: string;
  establecimiento?: Omit<UpdateEstablishmentInput, 'estado'>;
}
