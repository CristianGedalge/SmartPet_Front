# Diseño
- Estado local collapsed en AppSidebar, inicializado desde smartpet-sidebar-collapsed de localStorage.
- Botón ChevronLeft/ChevronRight con aria-expanded y aria-controls.
- Clase is-collapsed en aside; reglas limitadas a min-width 761px. Ancho compacto 80px.
- Selector hermano ajusta el margen del workspace; transición de ancho/margen con respeto a reduced-motion.
- Etiquetas de enlaces como tooltips visibles con hover/focus-visible. Nombre accesible mediante aria-label.
- Menú de cuenta se abre al lado del rail en escritorio y conserva su posición original en móvil.
