# Verificación y mantenimiento

- Rutas públicas: `/terminos` y `/privacidad`; enlaces en footer.
- Registro: dos casillas sin marcar, aceptación obligatoria y bloqueo adicional en submit. Los enlaces abren otra pestaña y conservan el borrador.
- Contrato: `aceptaTerminos: true`, `aceptaPrivacidad: true`, `versionLegal: "2026-11-18.1"`. Validado también en la API.
- Contenido canónico: `src/features/legal/content/legal.json`. Mantener su copia Flutter y las constantes de versión sincronizadas.
- Responsable y contacto confirmados: Equipo SmartPet, cristian.gedalge2018@gmail.com.
- `node scripts/check-legal.cjs`: prueba local en Edge con Vite en `127.0.0.1:5188`, mapa y registro simulados. Verifica documentos, enlaces, preservación del formulario, payload, bloqueo con una casilla y ancho móvil. Usa un perfil temporal propio.
- Contrato y migración: `smartpet_api/docs/legal.md`.
