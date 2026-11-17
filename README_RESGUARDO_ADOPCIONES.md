# Resguardo y adopciones en la web

- `/pets`: ENCARGADO registra animales resguardados con fotos, edita ficha y gestiona fotografias. Asociacion automatica a su veterinaria/refugio activo. Desde el detalle publica para adopcion.
- `/adoptions`: ENCARGADO gestiona sus publicaciones, edita textos, retira, republica y marca animales adoptados con confirmacion. La adopcion deja la ficha como historial de solo lectura.
- `/adopciones`: catalogo publico sin login, detalle con fotos, requisitos y contacto institucional. Acceso tambien desde el pie del login.

Sin solicitudes, datos de adoptantes, chat, verificacion ni IA. No se cambia el movil. Sin paquetes ni variables nuevas; se mantiene VITE_API_URL.

Backend: aplicar migraciones con `npm run migration:run` desde smartpet_api; iniciar API y `npm run dev` en smartpet_front. El origen web debe estar permitido en CORS_ORIGINS. Revisar con `npm run lint` y `npm run build`.

[Contratos](../smartpet_api/docs/resguardo-adopciones.md). Especificaciones: `specs/resguardo-adopciones/`. Pruebas HTTP en `smartpet_api/test/resguardo-adopciones.e2e-spec.ts` con PostgreSQL aislado y Cloudinary simulado. Comprobacion del navegador con sesion/API simuladas, sin crear registros reales.

Validacion de esta entrega: frontend/backend lint y build correctos; 151 pruebas unitarias y 39 HTTP aprobadas. Navegador: registro multipart con foto, publicacion, retiro, republicacion, catalogo con reintento/contacto y adopcion terminal. Migracion aplicada y catalogo real HTTP 200. Cloudinary simulado en las pruebas.
