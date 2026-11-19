# Mapa de calor web

Vista compartida para ADMIN y ENCARGADO, accesible en menú Mapa de calor. Rutas /admin/heatmap y /heatmap bajo guards actuales. Consumir solo GET /analitica/mapa-calor; no construir calor descargando fichas públicas paginadas.

Seleccionar Alertas de extravío o Avistamientos; al cambiar tipo restaurar estado activo compatible. Estado y fechas desde/hasta opcionales; aplicar fechas con botón Aplicar filtros y mantener fecha seleccionada al alternar tipo. Actualizar datos, errores/reintento, vacío y resumen real. El mapa base permanece visible sin reportes; no presentar datos de un filtro anterior como si fueran actuales. Cancelar solicitudes antiguas.

MapLibre/OpenFreeMap Liberty con VITE_MAP_STYLE_URL existente. Capa heatmap ponderada por cantidad de reportes, leyenda de concentración relativa y detalles de celda en zoom cercano, sin coordenadas numéricas para el usuario. Agrupación aproximada: aclarar que cuenta reportes, no mascotas diferentes. Botón Ver todos los reportes ajusta el encuadre, zoom y desplazamiento habituales. Mantener atribución y accesibilidad; estados de error del mapa y reintento sin perder filtros. Adaptable a móvil/laptop. Liberar mapa, eventos, ventanas, observador de tamaño y temporizadores al desmontar. Sin dependencias ni env nuevos.
