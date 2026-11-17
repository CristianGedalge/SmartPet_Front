import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ListPagination } from '../../../components/shared/ListPagination';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { useAuth } from '../../../hooks/useAuth';
import { rescueService } from '../services/rescue.service';
import { AnimalForm } from '../components/AnimalForm';
import { AnimalDetail } from '../components/AnimalDetail';
import { AnimalImage } from '../components/AnimalImage';
import { PublicationForm } from '../../adoptions/components/PublicationForm';
import type { ShelteredAnimal } from '../types/pet.types';
type Dialog={kind:'create'}|{kind:'detail';id:string}|{kind:'edit'|'publish';animal:ShelteredAnimal};
export default function EncargadoPetsPage() {
  const {user}=useAuth();
  const list=usePaginatedList(rescueService.list);
  const [dialog,setDialog]=useState<Dialog|null>(null),[success,setSuccess]=useState('');
  const active=user?.establecimiento?.estado===true;
  function saved(){setDialog(null);setSuccess('Los cambios se guardaron correctamente.');list.refresh();}
  return <div className="directory-page rescue-page">
    <div className="dashboard-intro"><div><p className="eyebrow">{user?.establecimiento?.nombre ?? 'MI ESTABLECIMIENTO'}</p><h1>Animales resguardados</h1><p>Registra su historia y ayúdales a encontrar un hogar cuando estén listos.</p></div><div className="rescue-actions"><Button variant="outline" onClick={list.refresh} disabled={list.loading}><RefreshCw size={16}/>Actualizar</Button><Button onClick={()=>setDialog({kind:'create'})} disabled={!active}><Plus size={17}/>Registrar animal</Button></div></div>
    {!active && <p role="alert" className="api-feedback error">Necesitas un establecimiento activo para gestionar animales. Consulta tu <Link to="/profile">perfil</Link>.</p>}
    {success && <p role="status" className="api-feedback success">{success}</p>}
    {list.loading ? <p role="status" className="api-loading">Cargando animales...</p> : list.error ? <div role="alert" className="api-error">{list.error}<Button onClick={list.refresh}>Reintentar</Button></div> : <>
      {!list.items.length && <section className="panel directory-empty"><h2>Tu primer rescate empieza aquí</h2><p>Registra al animal con su ficha y fotografías. Podrás publicarlo para adopción en un paso separado.</p></section>}
      <div className="rescue-grid">{list.items.map(animal=><article key={animal.id} className="panel rescue-card"><AnimalImage url={animal.mascota.fotos[0]?.url} name={animal.mascota.nombre}/><div className="rescue-card-body"><span className="status-pill enabled">{animal.estado==='ADOPTADO' ? 'Adoptado' : 'En resguardo'}</span><h2>{animal.mascota.nombre}</h2><p>{animal.mascota.especie?.nombre}{animal.mascota.color && ' / '+animal.mascota.color}</p><p className="api-muted">{animal.publicacion ? animal.publicacion.estado==='PUBLICADA' ? 'Disponible para adopción' : animal.publicacion.estado==='RETIRADA' ? 'Publicación retirada' : 'Adopción registrada' : 'Sin publicación de adopción'}</p><Button variant="outline" onClick={()=>{setSuccess('');setDialog({kind:'detail',id:animal.id});}}>Ver ficha y gestionar</Button></div></article>)}</div>
      <ListPagination page={list.page} hasNext={list.hasNext} loading={list.loading} onPage={list.setPage}/>
    </>}
    {dialog?.kind==='create' && <AnimalForm onClose={()=>setDialog(null)} onSaved={saved}/>}
    {dialog?.kind==='edit' && <AnimalForm animal={dialog.animal} onClose={()=>setDialog(null)} onSaved={saved}/>}
    {dialog?.kind==='detail' && <AnimalDetail id={dialog.id} onClose={()=>setDialog(null)} onEdit={animal=>setDialog({kind:'edit',animal})} onPublish={animal=>setDialog({kind:'publish',animal})} onChanged={list.refresh}/>}
    {dialog?.kind==='publish' && <PublicationForm animalId={dialog.animal.id} onClose={()=>setDialog(null)} onSaved={saved}/>}
  </div>;
}
