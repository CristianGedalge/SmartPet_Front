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
  ESTABLECIMIENTOS: {
    BASE: '/establecimientos',
    BY_ID: (id: string) => `/establecimientos/${id}`,
  },
} as const;
