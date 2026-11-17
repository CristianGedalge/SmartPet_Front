import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { ListPagination } from '../../../components/shared/ListPagination';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { adoptionsService } from '../services/adoptions.service';
import { AdoptionCard } from '../components/AdoptionCard';
import { PublicationForm } from '../components/PublicationForm';
import { AdoptionConfirmation } from '../components/AdoptionConfirmation';
import type { AdoptionAction,AdoptionPublication } from '../types/adoption.types';
export default function EncargadoAdoptionsPage() {
  const list=usePaginatedList(adoptionsService.mine);
  const [editing,setEditing]=useState<AdoptionPublication|null>(null);
  const [changing,setChanging]=useState<{publication:AdoptionPublication;action:AdoptionAction}|null>(null);
  const [success,setSuccess]=useState('');
  function saved(){setEditing(null);setChanging(null);setSuccess('Publicación actualizada.');list.refresh();}
  return <div className="directory-page rescue-page"><div className="dashboard-intro"><div><p className="eyebrow">UN HOGAR PARA CADA HISTORIA</p><h1>Adopciones</h1><p>Gestiona las publicaciones de tu establecimiento.</p></div><div className="rescue-actions"><Link className="api-text-button" to="/pets">Registrar o elegir animal</Link><Link className="api-text-button" to="/adopciones">Ver catálogo público</Link><Button variant="outline" disabled={list.loading} onClick={list.refresh}>Actualizar</Button></div></div>
    {success && <p role="status" className="api-feedback success">{success}</p>}
    {list.loading ? <p role="status" className="api-loading">Cargando publicaciones...</p> : list.error ? <div role="alert" className="api-error">{list.error}<Button onClick={list.refresh}>Reintentar</Button></div> : <>
      {!list.items.length && <section className="panel directory-empty"><h2>Aún no publicaste animales para adopción</h2><p>Registra un animal resguardado y publica su ficha cuando esté listo para encontrar un hogar.</p><Link to="/pets" className="api-text-button">Ver animales resguardados</Link></section>}
      <div className="rescue-grid">{list.items.map(publication=><AdoptionCard key={publication.id} publication={publication}>
        {publication.estado!=='ADOPTADA' && <Button variant="outline" onClick={()=>setEditing(publication)}>Editar publicación</Button>}
        {publication.estado==='PUBLICADA' && <><Button variant="outline" onClick={()=>setChanging({publication,action:'retirar'})}>Retirar</Button><Button onClick={()=>setChanging({publication,action:'adoptar'})}>Marcar adoptado</Button></>}
        {publication.estado==='RETIRADA' && <Button onClick={()=>setChanging({publication,action:'publicar'})}>Volver a publicar</Button>}
        {publication.fechaAdopcion && <p className="api-muted">Adopción registrada el {new Date(publication.fechaAdopcion).toLocaleDateString('es')}</p>}
      </AdoptionCard>)}</div><ListPagination page={list.page} hasNext={list.hasNext} loading={list.loading} onPage={list.setPage}/>
    </>}
    {editing && <PublicationForm animalId={editing.animalResguardadoId} publication={editing} onClose={()=>setEditing(null)} onSaved={saved}/>}
    {changing && <AdoptionConfirmation {...changing} onClose={()=>setChanging(null)} onSaved={saved}/>}
  </div>;
}
