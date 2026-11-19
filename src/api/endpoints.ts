export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  ROLES: {
    LIST: '/roles',
  },
  USUARIOS: {
    BASE: '/usuarios',
    BY_ID: (id: string) => `/usuarios/${id}`,
  },
  PLANES: {
    BASE: '/planes',
    BY_ID: (id: string) => `/planes/${id}`,
  },
  SUSCRIPCIONES: {
    BY_USER: (id: string) => `/suscripciones/usuarios/${id}`,
  },
  ESTABLECIMIENTOS: {
    BASE: '/establecimientos',
    BY_ID: (id: string) => `/establecimientos/${id}`,
  },
  MASCOTAS: {
    BASE: '/mascotas',
    BY_ID: (id: string) => `/mascotas/${id}`,
  },
  ESPECIES: {
    LIST: '/especies',
  },
} as const;
