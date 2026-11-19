# Diseño

## Rutas

- `/admin/roles`: `AdminRolesPage`.
- `/admin/species`: `AdminSpeciesPage`.

Ambas rutas viven dentro de `RoleGuard(['ADMIN'])` y `AdminLayout`.

## Componentes

- `AdminReferenceCatalog`: vista reutilizable de catálogo, búsqueda y estados de la consulta.
- `AdminRolesPage`: configura título, descripción y carga de roles.
- `AdminSpeciesPage`: configura título, descripción y carga de especies.

## Servicio y tipos

- `referenceCatalogsService.roles(signal)` usa `ENDPOINTS.ROLES.LIST`.
- `referenceCatalogsService.species(signal)` usa `ENDPOINTS.ESPECIES.LIST`.
- Ambos catálogos comparten la forma `{ id: number; nombre: string }`.

## Navegación

El menú lateral y el buscador del encabezado incluyen enlaces a las dos rutas.

