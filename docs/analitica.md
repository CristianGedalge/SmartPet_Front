# Mapa de calor

Disponible en el menú **Mapa de calor** de los dos portales:

- ADMIN: `/admin/heatmap`.
- ENCARGADO: `/heatmap`.

Seleccionar **Alertas de extravío** o **Avistamientos**, el estado y, opcionalmente, las fechas del evento. Tipo y estado actualizan la consulta de inmediato; las fechas se aplican con **Aplicar fechas**. Al cambiar de tipo se selecciona su estado activo y se conservan las fechas ya aplicadas. **Actualizar datos** vuelve a consultar la API. No hay actualización automática en tiempo real.

El mapa usa MapLibre y el estilo existente `VITE_MAP_STYLE_URL` (OpenFreeMap Liberty por defecto), sin API key. `VITE_API_URL` permanece igual. Consulta `GET /analitica/mapa-calor` con el JWT de la sesión. El backend también valida los roles.

Los colores indican concentración relativa, no riesgos ni número de mascotas únicas. La leyenda cambia de menor a mayor concentración. Se muestran ubicaciones agrupadas y aproximadas; las coordenadas se usan internamente. Al acercarse (zoom 12 o mayor), pulsar un punto muestra la cantidad de reportes de esa zona. **Ver todos los reportes** ajusta la vista a los datos actuales.

Se mantienen el mapa base y un aviso cuando no hay resultados. Durante una consulta o tras un error se vacía la capa de reportes para no mezclar filtros con datos anteriores. Las peticiones anteriores se cancelan al cambiar de filtros. Los errores permiten reintentar datos y recargar el mapa por separado.

Al salir de la página se eliminan el mapa, ventanas emergentes, eventos y observador de tamaño. La configuración del estilo y del worker se comparte con el selector de ubicación del registro, sin cambiar su contrato.

## Comprobaciones

`npm run lint` y `npm run build`.

Prueba de navegador reproducible en Windows con Edge y Node con WebSocket global:

1. Iniciar Vite: `npm run dev -- --host 127.0.0.1 --port 5188 --strictPort`.
2. En otra terminal del frontend: `node scripts/check-heatmap.cjs`.

La prueba usa respuestas de API ficticias y un estilo local mínimo interceptado para comprobar WebGL sin depender de servicios externos. Verifica ambos portales, filtros, ventana emergente, peticiones canceladas, vacío, error y reintento, desmontaje y ancho móvil. Guarda capturas en el directorio temporal del sistema; no demuestra disponibilidad de los mosaicos externos ni usa datos reales.

Referencia de la capa: [ejemplo oficial de MapLibre](https://maplibre.org/maplibre-gl-js/docs/examples/create-a-heatmap-layer/).
