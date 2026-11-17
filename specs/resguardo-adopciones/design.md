# Diseno web

ENCARGADO /pets reemplaza placeholder por Animales resguardados: lista paginada, registrar ficha y fotos, detalle editable, gestion de fotos y accion publicar. /adoptions permite gestionar publicaciones propias, editar texto, retirar, republicar o marcar adoptado con confirmacion. Sidebar incorpora Adopciones y acceso al catalogo publico /adopciones. Catalogo publico fuera de guards muestra tarjetas y detalle con contacto institucional; sin flujo de solicitudes ni acceso ciudadano web privado.

Reutilizar usePaginatedList, Modal, Button, apiClient, estilos verde/menta existentes. Modulo features/pets para registro/ficha, features/adoptions para tipos/servicio/catalogo/gestion. Componentes compartidos de formularios y fotos, object URLs con revocacion al desmontar, abortar lecturas al desmontar, bloqueo de doble envio, mostrar carga/vacio/error/reintento y mensajes espanoles. No enviar rol/propietario/establecimiento; API decide el contexto. Axios multipart sin Content-Type JSON y timeout 120s solo subidas. Fotos validadas por tamano/MIME y servidor valida bytes. No coordenadas ni servicios externos nuevos.

Contratos en smartpet_api/specs/resguardo-adopciones/design.md. React.lazy para nuevas paginas, guard ENCARGADO y acceso publico al catalogo. Mantener rutas ADMIN y mascotas personales moviles. Sin dependencias nuevas.

El pie de autenticacion enlaza al catalogo publico. La prueba de navegador usa perfil temporal de Edge y transporte simulado, sin datos reales.
