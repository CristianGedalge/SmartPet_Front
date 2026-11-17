import { useState, type FormEvent } from 'react';
import { Modal } from '../../../components/shared/Modal';
import { Button } from '../../../components/ui/button';
import { getApiErrorMessage } from '../../../utils/error.utils';
import type { PublicationSummary } from '../../pets/types/pet.types';
import { adoptionsService } from '../services/adoptions.service';
export function PublicationForm({animalId,publication,onSaved,onClose}:{animalId:string;publication?:PublicationSummary;onSaved:()=>void;onClose:()=>void}) {
  const [description,setDescription]=useState(publication?.descripcion ?? ''),[requirements,setRequirements]=useState(publication?.requisitos ?? '');
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  async function save(event:FormEvent) {
    event.preventDefault();if(busy) return;
    if(!description.trim()) {setError('Describe al animal y el hogar que necesita.');return;}
    setBusy(true);setError('');
    try {const data={descripcion:description.trim(),requisitos:requirements.trim() || null};if(publication) await adoptionsService.update(publication.id,data);else await adoptionsService.create(animalId,data);onSaved();}
    catch(err:unknown) {setError(getApiErrorMessage(err,'No se pudo guardar la publicación.'));}finally {setBusy(false);}
  }
  return <Modal title={publication ? 'Editar publicación' : 'Publicar para adopción'} onClose={onClose} busy={busy}><form onSubmit={event=>void save(event)}>
    <p className="api-muted">La ficha, las fotos y el contacto de tu establecimiento aparecerán en el catálogo público.</p>
    <fieldset disabled={busy}><div className="api-form-grid">
      <label className="api-field api-field-wide">Descripción para adopción<textarea required maxLength={2000} rows={5} value={description} onChange={e=>setDescription(e.target.value)}/></label>
      <label className="api-field api-field-wide">Requisitos (opcional)<textarea maxLength={2000} rows={4} value={requirements} onChange={e=>setRequirements(e.target.value)}/></label>
    </div></fieldset>
    {error && <p role="alert" className="api-feedback error">{error}</p>}
    <div className="api-modal-actions"><Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancelar</Button><Button disabled={busy}>{busy ? 'Guardando...' : publication ? 'Guardar cambios' : 'Publicar para adopción'}</Button></div>
  </form></Modal>;
}
