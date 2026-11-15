# AGENTS.md — `smartpet_front`

Frontend web de SmartPet: React + TypeScript + Vite, consumo de API REST (`smartpet_api` bajo `/api/v1`) con autenticación JWT y control de acceso por roles (`ADMIN`, `ENCARGADO`, `CIUDADANO`).

## Metodología (SDD)

No escribir código sin spec previa. `specs/` es la fuente de verdad.

1. `specs/<modulo>/spec.md`: objetivo, requisitos, flujos de usuario por rol y criterios de aceptación.
2. `specs/<modulo>/design.md`: rutas web, páginas, componentes, estado, interfaces TypeScript y endpoints consumidos.
3. `specs/<modulo>/tasks.md`: tareas pequeñas y ordenadas.
4. Implementar y verificar contra los criterios de aceptación.

- No inventar vistas, campos ni llamadas a endpoints que no estén en la spec.
- Si algo es ambiguo, preguntar al usuario.
- Bugfixes pequeños y ajustes visuales menores sin cambio de flujo no requieren spec nueva.

## Estructura

- `src/config/` — variables de entorno (`VITE_API_URL`) y constantes globales
- `src/shared/` — componentes UI reutilizables, layouts, cliente HTTP (Axios/fetch con interceptor JWT) y guards de rutas por rol
- `src/modules/<modulo>/` — un directorio por dominio (`pages/`, `components/`, `services/`, `hooks/`, `types/`)
- `specs/` — specs, designs y tasks

## Comandos

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Convenciones

- Consumir únicamente los contratos definidos en `smartpet_api` (`/api/v1`).
- Tipado estricto en TypeScript: definir interfaces para requests y responses de cada módulo (evitar `any`).
- Separar las vistas/componentes (`pages/`, `components/`) de las llamadas HTTP (`services/`).
- Proteger las rutas privadas validando el token JWT y el rol del usuario (`ADMIN`, `ENCARGADO`, `CIUDADANO`).
- Manejar siempre los estados de carga (`loading`), vacío (`empty`) y error (`error`) en tablas y formularios.
- Variables de entorno con prefijo `VITE_` en `.env` (documentadas con descripción en `.env.example`); nunca commitear `.env`.
- Pedir confirmación antes de instalar dependencias en `package.json`.

## Definition of Done

1. Cumple la spec y el design.
2. Maneja validaciones de formulario, estados de carga y mensajes de error en español.
3. `npm run lint` y `npm run build` pasan sin errores.
