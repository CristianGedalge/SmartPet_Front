# Registro en dos pasos

## Requisitos
- Una sola tarjeta, con indicador Paso 1 de 2 / Paso 2 de 2 y progreso accesible.
- Paso 1: nombre, apellido, correo, teléfono personal y contraseña. Continuar valida los campos visibles sin llamar a la API.
- Paso 2: nombre/tipo de establecimiento, dirección, teléfono y ubicación con mapa/GPS. No exponer campos de coordenadas.
- Atrás conserva ambos formularios y la ubicación elegida en memoria; no guardar contraseña en almacenamiento persistente.
- Solo Crear cuenta y establecimiento llama al endpoint existente POST /auth/register con todos los datos juntos y sin rol.
- Validación de campos y ubicación, manejo de errores de servidor y bloqueo durante envío. Ante error conservar datos y permitir corregir ambos pasos.
- Navegación con teclado/Enter, foco en título al cambiar paso y diseño responsive.
- Conservar login, contrato de API y sesión tras registro exitoso. Sin dependencias nuevas.
