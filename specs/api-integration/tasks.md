# Tareas
- [x] Servicios tipados de usuarios, roles, establecimientos y perfil; sesión validada por GET /auth/profile.
- [x] Directorios administrativos con paginación, detalle, edición, baja lógica y reactivación.
- [x] Edición de perfil y establecimiento propio del encargado.
- [x] Integración de ruta, navegación, búsqueda y estilos responsive.
- [x] Build y lint pasan.
- [x] API local real: login y GET perfil/roles/usuarios/establecimientos responden 200. Una cuenta, tres roles y cero establecimientos durante la comprobación.
- [x] Chrome con API interceptada: paginación, GET detalle, PATCH, error/reintento, DELETE/reactivación, roles, coordenadas decimales, perfil, confirmación de contraseña, establecimiento propio, móvil y expiración 401.
- [x] Las pruebas de escritura no modificaron datos reales.

## Límites
No hay APIs de mascotas, adopciones, estadísticas globales o notificaciones; esos módulos mantienen sus estados pendientes. Los filtros de directorios son locales a la página consultada, identificados en la interfaz.
