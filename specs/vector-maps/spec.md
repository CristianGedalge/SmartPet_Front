# Mapas vectoriales

Migrar el selector compartido de registro, perfil del encargado y administración a MapLibre GL JS con OpenFreeMap Liberty, sin claves de API.

Conservar el contrato `{ latitud, longitud }`, selección por clic y teclado, desplazamiento, zoom, GPS, marcador y estado deshabilitado. Las coordenadas permanecen internas, sin campos numéricos para el usuario. El marcador tendrá una ventana emergente con texto descriptivo.

Usar `VITE_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/liberty`, reemplazando `VITE_MAP_TILE_URL`. No modificar `VITE_API_URL` ni los contratos del backend.

Criterios: selección y carga de registros existentes funcionan en todos los consumidores; volver entre pasos conserva la ubicación; desmontar elimina mapa, marcador, popup, observador y eventos; errores de carga y GPS se comunican en español; lint y build pasan.
