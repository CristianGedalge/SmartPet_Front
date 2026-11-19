# Catálogos administrativos

## Objetivo

Permitir que el administrador consulte desde el panel web los roles y las especies disponibles en SmartPet.

## Requisitos

- Agregar las secciones `Roles` y `Especies` al menú del panel administrador.
- Consumir `GET /roles` y `GET /especies` con la sesión del administrador.
- Mostrar el identificador y el nombre de cada registro.
- Permitir buscar por identificador o nombre dentro de los resultados cargados.
- Permitir volver a cargar cada catálogo.
- Mostrar únicamente las operaciones disponibles, sin mensajes técnicos sobre la implementación del backend.
- Manejar carga, error, reintento y catálogo vacío en español.
- Mantener ambas rutas protegidas para el rol `ADMIN`.

## Flujo ADMIN

1. El administrador abre `Roles` o `Especies` desde el menú lateral o el buscador del encabezado.
2. La vista consulta el catálogo correspondiente.
3. El administrador puede buscar un registro y actualizar los datos mostrados.

## Criterios de aceptación

- `/admin/roles` lista la respuesta de `GET /roles`.
- `/admin/species` lista la respuesta de `GET /especies`.
- Un error de red muestra un mensaje y una acción de reintento.
- Una búsqueda sin coincidencias se distingue de un catálogo vacío.
- No aparecen acciones que la API no soporta.

