# Formulario de contacto empresarial

El footer de la landing empresarial muestra un formulario para enviar directamente una consulta al administrador, sin abrir Gmail ni otra aplicación. Solicita nombre, correo, asunto y mensaje; informa carga, éxito y error en español. Conserva teléfono, correo y ubicación visibles en el footer. Solo se muestra en `/`; las demás páginas mantienen el footer informativo.

El formulario consume `POST /contacto`, no exige sesión, no incluye credenciales y no borra datos escritos ante un error. Tras éxito limpia los campos. Debe ser accesible, adaptable y bloquear envíos duplicados mientras está cargando.
