# Spec: `admin-pets` — Gestión Administrativa de Mascotas (`/admin/pets`)

## 1. Objetivo
Conectar la vista `/admin/pets` del panel administrativo con `smartpet_api` para que el `ADMIN` pueda **ver (listar y consultar detalle), editar y eliminar (desactivar/reactivar)** las mascotas registradas en la plataforma, **sin opción de crear**.

## 2. Requisitos Funcionales
- **RF-01 Listado paginado (`GET /api/v1/mascotas/admin`):** Mostrar tabla paginada de mascotas con foto principal, nombre, especie, raza, sexo, color, peso, edad, propietario (`nombre`, `apellido`, `email`) y estado (`Activo` / `Inactivo`).
- **RF-02 Filtro por especie (`GET /api/v1/especies`) y búsqueda local:** Filtrar por especie en la página actual y buscar por nombre, raza, color o propietario.
- **RF-03 Detalle y Edición (`GET /api/v1/mascotas/admin/:id` y `PATCH /api/v1/mascotas/admin/:id`):** Abrir modal con las fotos de la mascota, información del propietario y formulario para editar `nombre`, `razaNombre`, `sexo`, `color`, `pesoKg` y `edadAproximadaMeses`.
- **RF-04 Eliminar / Baja lógica (`DELETE /api/v1/mascotas/admin/:id`):** Desactivar la mascota (`estado = false`) con modal de confirmación (y permitir reactivarla con `PATCH { estado: true }`).
- **RF-05 Sin creación:** El administrador no tiene botón ni formulario para crear mascotas desde `/admin/pets`.
