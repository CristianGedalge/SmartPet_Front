import { useState, type FormEvent } from 'react';
import { Modal } from '../../../components/shared/Modal';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { getApiErrorMessage } from '../../../utils/error.utils';
import { adoptionsService } from '../services/adoptions.service';
import type { AdoptionAction, AdoptionPublication } from '../types/adoption.types';

function localToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

export function AdoptionConfirmation({publication,action,onSaved,onClose}:{publication:AdoptionPublication;action:AdoptionAction;onSaved:()=>void;onClose:()=>void}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const [nombre,setNombre]=useState(''),[telefono,setTelefono]=useState('');
  const [fecha,setFecha]=useState(localToday),[observaciones,setObservaciones]=useState('');
  const title=action==='adoptar' ? 'Registrar adopción' : action==='retirar' ? 'Retirar publicación' : 'Volver a publicar';
  async function save(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(busy)return;
    if(action==='adoptar' && (!nombre.trim() || !telefono.trim() || !fecha)) {
      setError('Completa el nombre, teléfono y fecha de entrega.');
      return;
    }
    setBusy(true);setError('');
    try {
      if(action==='adoptar') await adoptionsService.adopt(publication.id,{
        nombreAdoptante:nombre.trim(),telefonoAdoptante:telefono.trim(),
        fechaAdopcion:fecha,observaciones:observaciones.trim() || null,
      });
      else await adoptionsService.action(publication.id,action);
      onSaved();
    } catch(err:unknown) {
      setError(getApiErrorMessage(err,'No se pudo actualizar la publicación.'));
    } finally {setBusy(false);}
  }
  return <Modal title={title} onClose={onClose} busy={busy}>
    <p className="api-confirm-copy"><strong>{publication.mascota.nombre}</strong></p>
    <p className="api-muted">{action==='adoptar' ? 'Registra a la persona que recibe al animal, tenga o no cuenta en SmartPet. La ficha quedará como historial de solo lectura y se retirará del catálogo. Esta acción no puede deshacerse.' : action==='retirar' ? 'Dejará de aparecer en el catálogo público. Podrás publicarlo nuevamente cuando esté disponible.' : 'La ficha y el contacto institucional volverán a estar disponibles en el catálogo público.'}</p>
    <form onSubmit={event=>void save(event)}>
      {action==='adoptar' && <fieldset disabled={busy} className="api-form-grid">
        <label className="api-field api-field-wide">Nombre completo del adoptante<Input name="nombreAdoptante" autoComplete="off" required maxLength={150} value={nombre} onChange={event=>setNombre(event.target.value)}/></label>
        <label className="api-field">Teléfono<Input name="telefonoAdoptante" type="tel" autoComplete="off" required maxLength={20} value={telefono} onChange={event=>setTelefono(event.target.value)}/></label>
        <label className="api-field">Fecha de entrega<Input name="fechaAdopcion" type="date" required value={fecha} onChange={event=>setFecha(event.target.value)}/></label>
        <label className="api-field api-field-wide">Observaciones (opcional)<textarea name="observaciones" rows={3} maxLength={2000} value={observaciones} onChange={event=>setObservaciones(event.target.value)}/></label>
        <p className="api-muted api-field-wide">Los datos del adoptante son privados y no se mostrarán en el catálogo público.</p>
      </fieldset>}
      {error && <p role="alert" className="api-feedback error">{error}</p>}
      <div className="api-modal-actions"><Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancelar</Button><Button type="submit" disabled={busy} variant={action==='retirar' ? 'danger' : 'primary'}>{busy ? 'Guardando...' : title}</Button></div>
    </form>
  </Modal>;
}
