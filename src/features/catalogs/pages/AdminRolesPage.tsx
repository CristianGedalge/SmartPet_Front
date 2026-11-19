import { AdminReferenceCatalog } from '../components/AdminReferenceCatalog';
import { referenceCatalogsService } from '../services/reference-catalogs.service';

export default function AdminRolesPage() {
  return (
    <AdminReferenceCatalog
      title="Roles"
      description="Consulta los perfiles de acceso disponibles en la plataforma."
      emptyMessage="No hay roles registrados."
      loadingMessage="Cargando roles…"
      load={referenceCatalogsService.roles}
    />
  );
}

