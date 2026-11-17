import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../../../components/shared/Modal';
import { Button } from '../../../components/ui/button';
import { useApiResource } from '../../../hooks/useApiResource';
import { getApiErrorMessage } from '../../../utils/error.utils';
import type { ShelteredAnimal } from '../types/pet.types';
import { rescueService } from '../services/rescue.service';
import { PhotoSelection } from './PhotoSelection';
import { AnimalImage } from './AnimalImage';
export function AnimalDetail({id,onClose,onEdit,onPublish,onChanged}:{id:string;onClose:()=>void;onEdit:(animal:ShelteredAnimal)=>void;onPublish:(animal:ShelteredAnimal)=>void;onChanged:()=>void}) {
  const load=useCallback((signal:AbortSignal)=>rescueService.get(id,signal),[id]);
  const resource=useApiResource(load);
  const [files,setFiles]=useState<File[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  async function run(action:()=>Promise<void>) {
    if(busy)return;setBusy(true);setError('');setNotice('');
    try {await action();resource.reload();onChanged();} catch(err:unknown) {setError(getApiErrorMessage(err,'No se pudo completar la operación.'));}finally {setBusy(false);}
  }
  const animal=resource.data;
  const editable=animal?.estado==='EN_RESGUARDO';
  return <Modal title="Ficha del animal resguardado" onClose={onClose} busy={busy}>
    {resource.loading ? <p role="status" className="api-loading">Cargando ficha...</p> : resource.error ? <div role="alert" className="api-error">{resource.error}<Button onClick={resource.reload}>Reintentar</Button></div> : animal && <>
      <div className="api-record-summary"><strong>{animal.mascota.nombre}</strong><span className="status-pill enabled">{editable ? 'En resguardo' : 'Adoptado'}</span></div>
      <div className="api-detail-info"><p>{animal.mascota.especie?.nombre} {animal.mascota.razaNombre && ' / '+animal.mascota.razaNombre}</p><p>Sexo: {animal.mascota.sexo ?? 'Sin especificar'}</p><p>Color: {animal.mascota.color ?? 'Sin especificar'}</p><p>Peso: {animal.mascota.pesoKg == null ? 'Sin especificar' : animal.mascota.pesoKg+' kg'}</p><p>Edad aproximada: {animal.mascota.edadAproximadaMeses == null ? 'Sin especificar' : animal.mascota.edadAproximadaMeses+' meses'}</p></div>
      <div className="rescue-actions">{editable && <Button variant="outline" disabled={busy} onClick={()=>onEdit(animal)}>Editar ficha</Button>}{editable && !animal.publicacion && <Button disabled={busy} onClick={()=>onPublish(animal)}>Publicar para adopción</Button>}{animal.publicacion && <Link className="api-text-button" to="/adoptions">Gestionar publicacion de adopción</Link>}</div>
      <h3 className="rescue-section-title">Fotografías</h3>
      <div className="rescue-photo-grid">{animal.mascota.fotos.map(photo=><div key={photo.id}><AnimalImage url={photo.url} name={animal.mascota.nombre}/><p className="api-muted">{photo.esPrincipal ? 'Foto principal' : 'Fotografía'}</p>{editable && <Button variant="outline" disabled={busy || animal.mascota.fotos.length<=1} onClick={()=>{
        if(!window.confirm('Eliminar esta foto? El animal debe conservar al menos una.'))return;
        void run(async()=>{const result=await rescueService.removePhoto(id,photo.id);setNotice(result.limpiezaPendiente ? 'Foto eliminada. La limpieza del archivo se reintentará automáticamente.' : 'Foto eliminada.');});
      }}>Eliminar foto</Button>}</div>)}</div>
      {editable && <><PhotoSelection files={files} onChange={setFiles} onError={setError} existing={animal.mascota.fotos.length} disabled={busy}/>{files.length>0 && <Button disabled={busy} onClick={()=>void run(async()=>{await rescueService.addPhotos(id,files);setFiles([]);setNotice('Fotografías agregadas.');})}>{busy ? 'Subiendo...' : 'Guardar fotos seleccionadas'}</Button>}</>}
      {!editable && <p className="api-muted">Adopción registrada. Se conserva la ficha como historial.</p>}
    </>}
    {error && <p role="alert" className="api-feedback error">{error}</p>}{notice && <p role="status" className="api-feedback success">{notice}</p>}
  </Modal>;
}
