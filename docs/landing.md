# Landing pública

Página principal en `/`, accesible sin sesión. Presenta SmartPet, la experiencia ciudadana móvil, las herramientas para veterinarias/refugios y el catálogo de adopciones. Utiliza el logo SVG y la fotografía local existentes; sus créditos siguen en `public/images/CREDITS.txt`.

`PublicLayout` comparte `SiteHeader` y `SiteFooter` entre `/` y `/adopciones`. Los portales privados y el diseño de autenticación conservan sus layouts. Los enlaces llevan a `/adopciones`, `/register`, `/login` y `/admin/login`. El header ofrece acceso al panel correspondiente si hay sesión de ADMIN o ENCARGADO. No hay enlaces ficticios de descarga, redes sociales o términos legales, ni cifras o testimonios inventados.

El menú móvil usa `aria-expanded`, se cierra al navegar y admite Escape con devolución del foco. Hay un enlace para saltar al contenido y preguntas frecuentes mediante `details/summary`. Las secciones admiten enlaces directos con fragmento, por ejemplo `/#establecimientos`. La vista de teléfono es una ilustración identificada como tal.

La landing no hace peticiones de API ni requiere nuevas variables o dependencias. El catálogo conserva sus consultas y modales existentes. React Router necesita el fallback habitual a `index.html` al desplegar una SPA para permitir abrir rutas directamente. No se publicó el sitio ni se crearon commits.

## Verificación local

`npm run lint` y `npm run build`.

Con Node y Edge instalados, ejecutar Vite en una terminal:

```powershell
npm run dev -- --host 127.0.0.1 --port 5188 --strictPort
```

En otra terminal del frontend:

```powershell
node scripts/check-landing.cjs
```

Comprueba imágenes locales, escritorio/ancho móvil, menú/Escape, anclas, FAQ, acceso al registro, enlace de administrador y catálogo vacío/error/reintento con API simulada. Guarda capturas en el directorio temporal del sistema.
