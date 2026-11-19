# Chatbot flotante del sitio empresarial

## Objetivo

Mostrar un acceso flotante al futuro asistente de SmartPet dentro del sitio web empresarial, sin conectar todavía servicios de inteligencia artificial ni endpoints.

## Requisitos

- Aparecer en las páginas públicas empresariales.
- No aparecer en la landing independiente para establecimientos (`/establecimientos`) ni en los portales autenticados.
- Permitir abrir y cerrar una vista previa del chat.
- Indicar de forma visible que la función estará disponible próximamente.
- No enviar mensajes ni realizar llamadas a la API.
- Adaptarse a escritorio y móvil sin provocar desbordamiento horizontal.
- Permitir cerrar el panel con su botón o con la tecla `Escape`.
- Exponer etiquetas accesibles y el estado abierto/cerrado en el botón flotante.

## Criterios de aceptación

1. En `/` se muestra un botón flotante de asistencia.
2. Al activarlo aparece un panel con una bienvenida, el estado `Próximamente` y el campo de mensaje deshabilitado.
3. El panel puede cerrarse y devuelve el foco al botón flotante.
4. En `/establecimientos` no se renderiza el chatbot.
5. La interfaz cabe en una pantalla móvil de 390 px sin desbordamiento horizontal.
6. El frontend compila y pasa ESLint.
