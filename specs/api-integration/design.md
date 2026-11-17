# Diseño
- Servicios de dominio con Axios existente y AbortSignal: usersService y establishmentsService, más authService.updateProfile.
- Tipos UpdateUserInput, UpdateEstablishmentInput, UpdateProfileInput y Role. Establecimiento incluye usuario opcional y coordenadas number|string|null del contrato real.
- AdminDirectory genérico comparte tabla responsive, paginación, diálogo de edición y confirmación de baja/activación. Las configuraciones de cada recurso enumeran columnas/campos y transformaciones de DTO.
- Hook usePaginatedList administra páginas de 10, cancela solicitudes y descarta resultados obsoletos. Filtros locales identificados como tales.
- ProfileSession en layouts carga/sincroniza perfil; bloquea contenido hasta validar sesión y muestra estado recuperable ante fallos de red. Stores solo se actualizan si el token sigue siendo el de la solicitud.
- ProfilePage usa formulario con datos actuales y guarda PATCH /auth/profile. Campos institucionales solo si hay establecimiento.
- Agregar ruta lazy /admin/establishments al router, sidebar y buscador.
- Se conservan todas las rutas y el diseño actual.
