# AGENTS.md — `smartpet_front`

Frontend web de SmartPet: React + TypeScript + Vite + Tailwind CSS + shadcn/ui, bajo **Feature-Based Architecture + Role-Based Routing** para los roles `ADMIN` y `ENCARGADO` (el rol `CIUDADANO` utiliza `smartpet_movil`).

## Metodología (SDD)

No escribir código sin spec previa. `specs/` es la fuente de verdad.

1. `specs/<modulo>/spec.md`: objetivo, requisitos, flujos por rol (`ADMIN` / `ENCARGADO`) y criterios de aceptación.
2. `specs/<modulo>/design.md`: rutas web, layouts, páginas, componentes, schemas, tipos y endpoints consumidos.
3. `specs/<modulo>/tasks.md`: tareas pequeñas y ordenadas.
4. Implementar y verificar contra los criterios de aceptación.

- No inventar vistas, campos ni llamadas a endpoints que no estén en la spec.
- Si algo es ambiguo, preguntar al usuario.
- Bugfixes pequeños y ajustes visuales menores sin cambio de flujo no requieren spec nueva.

## Estructura (`src/`)

- `api/` — instancia de Axios, interceptores JWT y constantes de endpoints (`/api/v1`)
- `components/ui/` — componentes base de `shadcn/ui`
- `components/shared/` — componentes transversales (Sidebar, Header, PageLoader, ErrorState)
- `layouts/` — `AuthLayout.tsx`, `AdminLayout.tsx` y `EncargadoLayout.tsx`
- `routes/` — configuración de React Router (`AppRouter.tsx`) y guards (`RoleGuard.tsx`, `PublicOnlyGuard.tsx`)
- `features/` — módulos por dominio (`auth/`, `dashboard/`, `users/`, `pets/`, `profile/`), cada uno con sus `pages/`, `components/`, `services/`, `hooks/`, `schemas/` y `types/` según necesite
- `hooks/` — hooks globales reutilizables
- `stores/` — estado global de sesión/autenticación (`auth.store.ts`)
- `types/` — tipos e interfaces globales (`RolNombre`, `AuthUser`, paginación)
- `utils/` — funciones auxiliares
- `styles/` — estilos globales y configuración de Tailwind CSS

## Comandos

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Convenciones

- **Separación de portales en el mismo dominio:**
  - Portal Encargado: `/login`, `/register`, `/dashboard`, `/pets`, `/profile`.
  - Portal Administrador: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/pets`, `/admin/profile`.
- Un `ADMIN` no puede ingresar por `/login` ni a las rutas de `ENCARGADO`, y viceversa (`RoleGuard.tsx`).
- Cargar páginas con `React.lazy` y `Suspense`.
- Evitar duplicar vistas, formularios y servicios entre roles cuando compartan lógica (ej. `LoginForm.tsx` reutilizado en `LoginPage.tsx` y `AdminLoginPage.tsx`).
- Variables de entorno con prefijo `VITE_` en `.env` (documentadas en `.env.example`); nunca commitear `.env`.
- Pedir confirmación antes de instalar dependencias en `package.json`.

## Definition of Done

1. Cumple la spec y el design.
2. Maneja validaciones de formulario, estados de carga y errores de acceso/API en español.
3. `npm run lint` y `npm run build` pasan sin errores.
