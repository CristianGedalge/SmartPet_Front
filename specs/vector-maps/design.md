# Diseño

Reutilizar `LocationPicker` y sus props actuales. Crear una instancia MapLibre por montaje, importar su CSS y configurar el worker con la integración de Vite. Mantener controles accesibles de zoom, teclado y GPS; usar marcador y Popup nativos con texto seguro. Actualizar el marcador al recibir valores del formulario sin recrear el mapa.

Guardar callbacks y estado deshabilitado vigentes en refs para los eventos nativos. Desactivar interacciones al guardar. Un ResizeObserver ajusta el canvas; la limpieza desconecta el observador y elimina los recursos MapLibre. Las respuestas tardías de geolocalización verifican que la instancia siga vigente.

No cambiar rutas, pantallas ni endpoints. Eliminar la proyección manual y los mosaicos raster. Conservar las atribuciones de las fuentes del estilo.
