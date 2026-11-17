> La implementacion raster inicial queda reemplazada por MapLibre GL JS + OpenFreeMap Liberty. Consulte specs/vector-maps para el diseno y los requisitos vigentes.

# Diseño
- utils/map.utils.ts: proyección Web Mercator y validación de coordenadas, sin dependencias.
- features/auth/components/LocationPicker.tsx: mosaicos visibles de https://tile.openstreetmap.org/{z}/{x}/{y}.png, tamaño medido con ResizeObserver, puntero/teclado y geolocalización nativa.
- RegisterPage mantiene LocationCoordinates|null. Se valida antes de llamar a registerEncargado y se incluyen latitud/longitud reales.
- Centro inicial de vista no equivale a ubicación confirmada. La selecci?n se confirma mediante un marcador y un mensaje, sin n?meros visibles.
- Límites de visualización Mercator ±85.05112878; los campos admiten todo WGS84 sin alterar el dato enviado.
- No se cambia package.json ni se crean endpoints.
- Referencias: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames y https://operations.osmfoundation.org/policies/tiles/.

## Revisión de UI
El selector deja de exponer entradas numéricas. DirectoryFields agrega el campo location y convierte los valores internos del formulario al mapa compartido. El mapa inicia centrado en la ubicación recibida y acepta required=false en edición. Mensajes al usuario describen puntos/ubicaciones, nunca piden coordenadas.

## Presentación del registro
El registro se distribuye en dos tarjetas: datos personales del encargado y datos institucionales con mapa. Se muestran en paralelo en escritorio y apiladas en móvil. Un único formulario conserva la transacción de registro existente; el login mantiene su ancho original.

## Presentación vigente
El flujo de registro en dos tarjetas fue sustituido por una tarjeta en dos pasos, según specs/registration-wizard/spec.md. Se conserva ubicación mediante mapa sin entradas numéricas.
