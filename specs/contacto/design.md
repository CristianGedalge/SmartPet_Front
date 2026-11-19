# Diseño

`ContactForm` en `features/contact/components`, con estado local controlado. `contact.service.ts` consume el cliente Axios existente. `SiteFooter` lo renderiza antes de sus columnas solo cuando pathname es `/`; el id `contacto` permanece en el footer para la navegación del header.

Campos con labels visibles, atributos required y límites iguales al DTO. Honeypot fuera del flujo visual. Botón con estados Enviar/Enviando, mensaje `role=status` para éxito y `role=alert` para error. Prueba de navegador simula la API y comprueba payload, éxito, limpieza, error y ancho móvil. Verificar lint/build.
