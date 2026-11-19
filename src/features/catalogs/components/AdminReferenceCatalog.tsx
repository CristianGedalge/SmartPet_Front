import { RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { useApiResource } from '../../../hooks/useApiResource';
import type { ReferenceCatalogItem } from '../types/catalog.types';

interface AdminReferenceCatalogProps {
  title: string;
  description: string;
  emptyMessage: string;
  loadingMessage: string;
  load: (signal: AbortSignal) => Promise<ReferenceCatalogItem[]>;
}

export function AdminReferenceCatalog({
  title,
  description,
  emptyMessage,
  loadingMessage,
  load,
}: AdminReferenceCatalogProps) {
  const catalog = useApiResource(load);
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase('es');
  const records = catalog.data ?? [];
  const filtered = records.filter((item) =>
    `${item.id} ${item.nombre}`.toLocaleLowerCase('es').includes(normalizedQuery),
  );

  return (
    <div className="directory-page catalog-page">
      <div className="dashboard-intro">
        <div>
          <p className="eyebrow">CONFIGURACIÓN DE SMARTPET</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <Button variant="outline" disabled={catalog.loading} onClick={catalog.reload}>
          <RefreshCw size={15} />
          Actualizar
        </Button>
      </div>

      <section className="panel directory-panel">
        <div className="directory-toolbar catalog-toolbar">
          <label className="directory-search">
            <Search size={17} />
            <input
              aria-label={`Buscar en ${title.toLocaleLowerCase('es')}`}
              placeholder="Buscar por ID o nombre…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          {!catalog.loading && !catalog.error && (
            <span className="catalog-count">
              {filtered.length} de {records.length} registros
            </span>
          )}
        </div>

        {catalog.loading ? (
          <p className="api-loading" role="status">{loadingMessage}</p>
        ) : catalog.error ? (
          <div className="api-error" role="alert">
            <p>{catalog.error}</p>
            <Button variant="outline" onClick={catalog.reload}>Reintentar</Button>
          </div>
        ) : (
          <div className="directory-table-scroll">
            <table className="directory-table catalog-table">
              <thead>
                <tr><th scope="col">ID</th><th scope="col">Nombre</th></tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td><span className="catalog-id">#{item.id}</span></td>
                    <td><strong className="catalog-name">{item.nombre}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <p className="directory-empty">
                {records.length ? 'No hay coincidencias para tu búsqueda.' : emptyMessage}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

