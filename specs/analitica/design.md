# Diseño

Feature analitica: HeatmapPage, HeatmapMap, servicio y tipos. Página lazy reutilizada en ambos portales. Menús con icono Map y etiqueta Mapa de calor. Filtros y tarjetas con Tailwind y componentes existentes Input/Button.

useApiResource con carga memorizada por filtros aplicados; AbortSignal evita respuestas fuera de orden. Mientras carga/falla, limpiar capa de puntos para no mezclar tipos; mostrar aviso sobre mapa base y contador solo del resultado actual. Errores de API separados de errores del mapa.

Mapa único por montaje: fuente GeoJSON actualizada por setData cuando cambia el resultado. Mantener referencia a los datos más recientes para estilo cargado después de la petición. Calor visible desde zoom lejano hasta cercano; peso normalizado a mayor cantidad en la consulta, leyenda relativa y radio ajustado al zoom. A zoom cercano, círculos permiten popup con cantidad y ubicación aproximada; usar setText. Ajustar límites al cargar datos nuevos y botón de reencuadre. Por defecto encuadre de Bolivia si no hay datos. Zoom máximo de ajuste 13 para que se vea calor al tener un solo grupo.

Compartir configuración de estilo/worker con LocationPicker sin alterar su selección, marcadores ni eventos. Sin coordenadas visibles ni claves. Documentar fuente oficial MapLibre heatmap. Pruebas de navegador con API simulada, estilos locales para render WebGL determinista y verificación de ambos roles, filtros, vacío/error, respuesta tardía, capa y destrucción al navegar.
