# Integración de APIs existentes

## Alcance
Conectar el frontend al contrato real de smartpet_api, sin modificar backend ni instalar dependencias.

## Requisitos
- ADMIN: /admin/users lista usuarios con paginación limit/offset, filtro por roles obtenidos de GET /roles y búsqueda limitada a la página actual.
- ADMIN: nueva ruta /admin/establishments para consultar establecimientos, su encargado, tipo, estado y ubicación.
- Ambos directorios permiten GET por ID para abrir detalle/edición, PATCH de campos permitidos y DELETE como baja lógica; reactivar con PATCH estado:true. Confirmación explícita antes de cambiar estado.
- Las respuestas PATCH/DELETE pueden omitir relaciones: refrescar listado/perfil mediante GET, no sobreescribir estado global con objetos incompletos.
- ADMIN/ENCARGADO: GET /auth/profile al entrar al portal; mostrar errores y reintento, sincronizar usuario y establecimiento actuales. Proteger contra respuestas tardías tras logout.
- Mi perfil: editar nombre, apellido, teléfono, URL de foto y contraseña opcional (8–72 caracteres). ENCARGADO también edita su establecimiento desde PATCH /auth/profile, nunca desde endpoints administrativos.
- Mantener correo y rol no editables. Roles son informativos/filtro: no existe endpoint para cambiarlos.
- Validar longitudes, URL de foto http(s), coordenadas numéricas/rangos. Convertir coordenadas de PostgreSQL (string decimal) a números en los formularios.
- Usar bearer token existente. Mostrar carga, vacío, error y éxito en español. Evitar doble envío, cancelar consultas obsoletas y reintentar tras fallos.
- Paginación consulta 11 registros y muestra 10 para detectar siguiente página sin inventar total.
- No calcular totales globales a partir de una página ni inventar estadísticas. Mascotas/notificaciones no se conectan sin endpoints.
- Pruebas con servidor real solo de lectura si está disponible; modificaciones de QA mediante interceptación, sin afectar cuentas existentes.

## Actualización de ubicación
La edición institucional utiliza mapa compartido en lugar de entradas numéricas; latitud/longitud son valores internos del payload, no controles de usuario.
