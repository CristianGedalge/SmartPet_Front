import { AdminReferenceCatalog } from '../components/AdminReferenceCatalog';
import { referenceCatalogsService } from '../services/reference-catalogs.service';

export default function AdminSpeciesPage() {
  return (
    <AdminReferenceCatalog
      title="Especies"
      description="Consulta las especies disponibles para registrar mascotas y animales resguardados."
      emptyMessage="No hay especies registradas."
      loadingMessage="Cargando especies…"
      load={referenceCatalogsService.species}
    />
  );
}

