> La implementacion raster inicial queda reemplazada por MapLibre GL JS + OpenFreeMap Liberty. Consulte specs/vector-maps para el diseno y los requisitos vigentes.

# Ubicación de establecimientos en el registro

## Objetivo
Permitir que un encargado indique la ubicación real de su veterinaria o refugio antes de registrarse; eliminar las coordenadas fijas.

## Requisitos y aceptación
- Mapa de OpenStreetMap centrado inicialmente en Santa Cruz, sin ubicación seleccionada automáticamente.
- Selección explícita con clic/toque; desplazamiento, zoom y selección con teclado.
- Botón opcional para usar ubicación del dispositivo, con manejo de permisos, indisponibilidad y tiempo de espera.
- Campos numéricos de latitud y longitud como alternativa accesible al mapa; valores finitos dentro de [-90,90] y [-180,180].
- Registro web requiere una ubicación elegida. El contrato backend no cambia; el formulario usa los campos existentes.
- El envío contiene los valores elegidos; conserva asignación automática de rol y token.
- No se instala ninguna dependencia. Se usa el formato raster XYZ documentado por OSM, con atribución visible, sin precarga ni descarga masiva.
- Mensajes de errores en español; interfaz adaptable a móvil.
## Ajuste solicitado: ubicación sin coordenadas visibles
- La interfaz nunca solicita ni muestra latitud/longitud como campos editables.
- Registro, edición administrativa y perfil del encargado usan el mismo mapa, GPS y selección por teclado.
- Las ubicaciones existentes se cargan y conservan, incluyendo valores decimales recibidos como texto. Un valor vacío no se interpreta como cero.
- El registro exige marcar un punto; la edición permite conservar un registro que todavía no tenga ubicación.
- Coordenadas y validación permanecen internas para cumplir el contrato de API.
- URL de estilo vectorial configurable con VITE_MAP_STYLE_URL en .env y documentada en .env.example.
