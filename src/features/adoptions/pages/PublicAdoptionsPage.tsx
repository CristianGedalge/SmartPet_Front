import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { ListPagination } from "../../../components/shared/ListPagination";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { adoptionsService } from "../services/adoptions.service";
import { AdoptionCard } from "../components/AdoptionCard";
import { PublicAdoptionDetail } from "../components/PublicAdoptionDetail";
export default function PublicAdoptionsPage() {
  const list = usePaginatedList(adoptionsService.list),
    [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="adoption-catalog">
      <main id="main-content">
        <section className="catalog-intro">
          <p className="eyebrow">ADOPTAR CAMBIA DOS VIDAS</p>
          <h1>Un nuevo hogar empieza contigo.</h1>
          <p>
            Conoce a los animales que veterinarias y refugios de nuestra
            comunidad tienen disponibles para adopción.
          </p>
        </section>
        {list.loading ? (
          <p role="status" className="api-loading">
            Buscando nuevos compañeros...
          </p>
        ) : list.error ? (
          <div role="alert" className="api-error">
            {list.error}
            <Button onClick={list.refresh}>Reintentar</Button>
          </div>
        ) : (
          <>
            {!list.items.length && (
              <section className="panel directory-empty">
                <h2>Pronto habrá nuevas historias</h2>
                <p>Las publicaciones disponibles aparecerán aquí.</p>
                <Button variant="outline" onClick={list.refresh}>
                  Actualizar
                </Button>
              </section>
            )}
            <div className="rescue-grid">
              {list.items.map((p) => (
                <AdoptionCard key={p.id} publication={p}>
                  <Button onClick={() => setSelected(p.id)}>
                    Conocer a {p.mascota.nombre}
                  </Button>
                </AdoptionCard>
              ))}
            </div>
            <ListPagination
              page={list.page}
              hasNext={list.hasNext}
              loading={list.loading}
              onPage={list.setPage}
            />
          </>
        )}
        {selected && (
          <PublicAdoptionDetail
            id={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </main>
    </div>
  );
}
