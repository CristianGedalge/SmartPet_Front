# Design: `admin-pets`

- **Endpoints (`src/api/endpoints.ts`):**
  - `ENDPOINTS.MASCOTAS_ADMIN.BASE = '/mascotas/admin'`
  - `ENDPOINTS.MASCOTAS_ADMIN.BY_ID = (id: string) => '/mascotas/admin/' + id`
  - `ENDPOINTS.ESPECIES.LIST = '/especies'`
- **Servicio (`src/features/pets/services/admin-pets.service.ts`):**
  - `list(limit, offset, signal)`
  - `get(id, signal)`
  - `update(id, payload)`
  - `deactivate(id)`
  - `species(signal)`
- **Página (`src/features/pets/pages/AdminPetsPage.tsx`):**
  - Reutiliza el componente compartido `<AdminDirectory config={config} />` (consistente con `/admin/users` y `/admin/establishments`), que ofrece únicamente visualización, edición y baja lógica/reactivación (sin botón de crear).
