import { useState } from 'react';
import { Modal } from '../../../components/shared/Modal';
import { Button } from '../../../components/ui/button';
import { getApiErrorMessage } from '../../../utils/error.utils';
import { adoptionsService } from '../services/adoptions.service';
import type { AdoptionAction,AdoptionPublication } from '../types/adoption.types';
export function AdoptionConfirmation({publication,action,onSaved,onClose}:{publication:AdoptionPublication;action:AdoptionAction;onSaved:()=>void;onClose:()=>void}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const title=action==='adoptar' ? 'Registrar adopción' : action==='retirar' ? 'Retirar publicación' : 'Volver a publicar';
  return <Modal title={title} onClose={onClose} busy={busy}><p className="api-confirm-copy"><strong>{publication.mascota.nombre}</strong></p><p className="api-muted">{action==='adoptar' ? 'Confirma que el animal ya fue adoptado. Se retirará del catálogo y su ficha quedará como historial de solo lectura. Esta accion no puede deshacerse.' : action==='retirar' ? 'Dejará de aparecer en el catálogo público. Podrás publicarlo nuevamente cuando esté disponible.' : 'La ficha y el contacto institucional volverán a estar disponibles en el catálogo público.'}</p>
    {error && <p role="alert" className="api-feedback error">{error}</p>}
    <div className="api-modal-actions"><Button variant="outline" disabled={busy} onClick={onClose}>Cancelar</Button><Button disabled={busy} variant={action==='retirar' ? 'danger' : 'primary'} onClick={()=>{
      if(busy)return;setBusy(true);setError('');void adoptionsService.action(publication.id,action).then(onSaved).catch((err:unknown)=>setError(getApiErrorMessage(err,'No se pudo actualizar la publicación.'))).finally(()=>setBusy(false));
    }}>{busy ? 'Guardando...' : title}</Button></div>
  </Modal>;
}
