import { useCallback } from 'react';
import { Modal } from '../../../components/shared/Modal';
import { Button } from '../../../components/ui/button';
import { useApiResource } from '../../../hooks/useApiResource';
import { adoptionsService } from '../services/adoptions.service';
import { AnimalImage } from '../../pets/components/AnimalImage';
export function PublicAdoptionDetail({id,onClose}:{id:string;onClose:()=>void}) {
  const load=useCallback((signal:AbortSignal)=>adoptionsService.get(id,signal),[id]);
  const resource=useApiResource(load),p=resource.data;
  return <Modal title="Conoce a tu nuevo compañero" onClose={onClose}>
    {resource.loading ? <p role="status" className="api-loading">Cargando ficha...</p> : resource.error ? <div role="alert" className="api-error">{resource.error}<Button onClick={resource.reload}>Reintentar</Button></div> : p && <>
      <h2 className="rescue-section-title">{p.mascota.nombre}</h2><p>{p.mascota.especie?.nombre} {p.mascota.razaNombre}</p>
      <div className="rescue-photo-grid">{p.mascota.fotos.map(photo=><AnimalImage key={photo.id} url={photo.url} name={p.mascota.nombre}/>)}</div>
      <p className="rescue-copy">{p.descripcion}</p>{p.requisitos && <><h3 className="rescue-section-title">Requisitos para adoptar</h3><p className="rescue-copy">{p.requisitos}</p></>}
      <div className="api-detail-info"><strong>{p.establecimiento.nombre}</strong><p>{p.establecimiento.tipo==='REFUGIO' ? 'Refugio / Albergue' : 'Veterinaria'}</p><p>{p.establecimiento.direccion}</p>{p.establecimiento.horarioAtencion && <p>{p.establecimiento.horarioAtencion}</p>}<p>Teléfono: <a href={'tel:'+p.establecimiento.telefono.replace(/[^+0-9]/g,'')}>{p.establecimiento.telefono}</a></p></div>
      <p className="api-muted">Contacta directamente al establecimiento para conocer al animal y coordinar la adopción.</p>
    </>}
  </Modal>;
}
