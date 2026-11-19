# Diseño

LandingPage institucional conserva servicios/comunidad y añade contacto, propósito y enlace a la landing de encargados. Nueva EstablishmentsLandingPage lazy bajo PublicLayout en /establecimientos con hero propio, funciones de resguardados/adopciones/mapa de calor, pasos de registro y CTA de ingreso. SiteHeader y SiteFooter seleccionan navegación según pathname; sin duplicar layouts ni lógica de autenticación. Enlaces anteriores /#establecimientos siguen apuntando a una sección válida que deriva al nuevo espacio. Sobre nosotros conserva su ruta; su CTA a registro pasa a la landing de establecimientos.

Validar lint/build, rutas, CTAs y ancho móvil en navegador local. Sin cambios de API ni datos.

Verificado: npm run lint y npm run build; scripts/check-dual-landing.cjs, scripts/check-about.cjs y scripts/check-landing.cjs. Pruebas locales con navegador y registro/API simulados donde corresponde.
