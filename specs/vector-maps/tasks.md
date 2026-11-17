# Tareas

- [x] Revisar selector, consumidores y contrato de coordenadas.
- [x] Instalar MapLibre y actualizar configuración del estilo.
- [x] Migrar selector, controles, marcador, popup y limpieza.
- [x] Verificar lint, build y comportamiento del formulario en navegador.

## Verificación

- `npm run lint` y `npm run build` terminan correctamente. Vite avisa del tamaño del módulo del mapa (aproximadamente 296 kB gzip), que se carga con las páginas que lo usan.
- Chrome: Liberty, sprites y fuentes cargan; selección por clic y teclado, desplazamiento, zoom, popup y GPS simulado (éxito y permiso denegado) funcionan sin excepciones JavaScript.
- Registro: validación de ubicación, conservación entre pasos, eliminación del canvas al volver, errores de API, reintento y diseño móvil sin desbordamiento.
- Perfil: carga ubicación existente, arrastre actualiza las coordenadas enviadas, guardar desactiva interacciones y foco del canvas, luego reactiva el mismo mapa sin duplicados.
- Las peticiones de escritura de las pruebas se interceptaron con respuestas simuladas; no se crearon cuentas ni se modificaron datos reales.
- `.env` y `.env.example`: se comprobó que `VITE_API_URL` conserva su valor y solo se sustituye la configuración del mapa.
