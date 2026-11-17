# Diseño

AdoptionConfirmation renderiza un formulario únicamente para adoptar: nombre (150), teléfono (20), fecha date, observaciones textarea (2000). Fecha inicial local actual. Llama adoptionsService.adopt(id, datos) por PATCH /adopciones/:id/adoptar. Retirar/publicar conservan {} y su confirmación.

Tipos AdoptionInput y AdoptionRecord. AdoptionPublication permite registroAdopcion opcional/null porque las respuestas públicas no lo contienen. En EncargadoAdoptionsPage se muestra nombre, teléfono, fecha y observaciones del registro privado como texto escapado. Fechas YYYY-MM-DD se presentan en calendario local sin desplazamiento de zona horaria. Reutilizar Input, Button y Modal; sin dependencias nuevas.
