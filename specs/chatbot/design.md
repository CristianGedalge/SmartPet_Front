# Diseño

## Integración

- `PublicLayout` decide si debe renderizar el chatbot según la ruta actual.
- `BusinessChatbot` mantiene únicamente el estado local de apertura.
- No se crean servicios, variables de entorno ni contratos HTTP en esta etapa.

## Componente

`src/features/chatbot/components/BusinessChatbot.tsx`

- Botón circular fijo en la esquina inferior derecha.
- Panel no modal anclado sobre el botón.
- Encabezado con identidad SmartPet, estado futuro y control de cierre.
- Mensaje introductorio que describe la disponibilidad futura.
- Entrada y botón de envío deshabilitados para evitar una interacción falsa.
- Gestión de `Escape` y retorno de foco al control que abrió el panel.

## Rutas

Se muestra en todas las rutas de `PublicLayout`, excepto `/establecimientos`. Las pantallas de autenticación y los paneles de administrador y encargado usan otros layouts y quedan fuera automáticamente.
