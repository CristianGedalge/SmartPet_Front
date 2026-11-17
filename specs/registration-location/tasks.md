# Tareas
- [x] Crear utilidades de proyección y selector accesible.
- [x] Integrar selección y validación en registro.
- [x] Verificar proyecciones, rangos, build y lint.
- [x] Comprobar selección con clic y teclado, coordenadas manuales, permiso GPS denegado y GPS exitoso en Chrome.
- [x] Verificar formulario sin ubicación inválido y payload con ubicación elegida, sin rol. Registro interceptado, sin crear cuentas.
- [x] Verificar mosaicos reales cargados y móvil 390px sin desbordamiento horizontal.

## Verificación: ubicación sin campos numéricos
- [x] Registro, edición administrativa y perfil del encargado usan mapa/GPS sin inputs de latitud/longitud.
- [x] Ubicaciones existentes se cargan como marcador y se conservan al editar otros datos.
- [x] Registro bloquea envío sin punto elegido; selección por teclado envía coordenadas internas numéricas.
- [x] URL del mapa configurable en .env y .env.example.
- [x] Chrome con escrituras interceptadas, build y lint verificados.
