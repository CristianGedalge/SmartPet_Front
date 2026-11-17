import { useState, type FormEvent } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Modal } from '../../../components/shared/Modal';
import { useApiResource } from '../../../hooks/useApiResource';
import { getApiErrorMessage } from '../../../utils/error.utils';
import type { AnimalInput, ShelteredAnimal } from '../types/pet.types';
import { rescueService } from '../services/rescue.service';
import { PhotoSelection } from './PhotoSelection';
export function AnimalForm({animal,onClose,onSaved}:{animal?:ShelteredAnimal;onClose:()=>void;onSaved:()=>void}) {
  const species=useApiResource(rescueService.species);
  const pet=animal?.mascota;
  const [values,setValues]=useState({nombre:pet?.nombre ?? '',especieId:String(pet?.especieId ?? ''),razaNombre:pet?.razaNombre ?? '',sexo:pet?.sexo ?? '',color:pet?.color ?? '',pesoKg:pet?.pesoKg == null ? '' : String(pet.pesoKg),edadAproximadaMeses:pet?.edadAproximadaMeses == null ? '' : String(pet.edadAproximadaMeses)});
  const [files,setFiles]=useState<File[]>([]), [busy,setBusy]=useState(false), [error,setError]=useState('');
  function field(key:keyof typeof values,value:string) {setValues(current=>({...current,[key]:value}));}
  async function save(event:FormEvent) {
    event.preventDefault();if(busy) return;
    if(!values.nombre.trim() || !values.especieId || (!animal && !files.length)) {setError('Completa nombre, especie y al menos una foto.');return;}
    const data:AnimalInput={nombre:values.nombre.trim(),especieId:Number(values.especieId),razaNombre:values.razaNombre.trim() || null,sexo:values.sexo || null,color:values.color.trim() || null,pesoKg:values.pesoKg === '' ? null : Number(values.pesoKg),edadAproximadaMeses:values.edadAproximadaMeses === '' ? null : Number(values.edadAproximadaMeses)};
    setBusy(true);setError('');
    try {if(animal) await rescueService.update(animal.id,data);else await rescueService.create(data,files);onSaved();}
    catch(err:unknown) {setError(getApiErrorMessage(err,'No se pudo guardar. Comprueba el resultado antes de volver a enviar.'));}
    finally {setBusy(false);}
  }
  return <Modal title={animal ? 'Editar animal resguardado' : 'Registrar animal resguardado'} onClose={onClose} busy={busy}>
    <p className="api-muted">La ficha quedará asociada a tu establecimiento. Publicar para adopción es un paso separado.</p>
    {species.loading ? <p role="status" className="api-loading">Cargando especies...</p> : species.error ? <div role="alert" className="api-error">{species.error}<Button onClick={species.reload}>Reintentar</Button></div> : <form onSubmit={event=>void save(event)}>
      <fieldset disabled={busy}><div className="api-form-grid">
        <label className="api-field">Nombre<Input required maxLength={100} value={values.nombre} onChange={e=>field('nombre',e.target.value)}/></label>
        <label className="api-field">Especie<select required value={values.especieId} onChange={e=>field('especieId',e.target.value)}><option value="">Selecciona una especie</option>{species.data?.map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}</select></label>
        <label className="api-field">Raza (opcional)<Input maxLength={100} value={values.razaNombre} onChange={e=>field('razaNombre',e.target.value)}/></label>
        <label className="api-field">Sexo<select value={values.sexo} onChange={e=>field('sexo',e.target.value)}><option value="">Sin especificar</option><option value="MACHO">Macho</option><option value="HEMBRA">Hembra</option><option value="DESCONOCIDO">Desconocido</option></select></label>
        <label className="api-field">Color (opcional)<Input maxLength={100} value={values.color} onChange={e=>field('color',e.target.value)}/></label>
        <label className="api-field">Peso en kg (opcional)<Input type="number" min="0.01" max="9999.99" step="0.01" value={values.pesoKg} onChange={e=>field('pesoKg',e.target.value)}/></label>
        <label className="api-field">Edad aproximada en meses (opcional)<Input type="number" min="0" max="2147483647" step="1" value={values.edadAproximadaMeses} onChange={e=>field('edadAproximadaMeses',e.target.value)}/></label>
        {!animal && <PhotoSelection files={files} onChange={setFiles} onError={setError} disabled={busy}/>}
      </div></fieldset>
      {error && <p role="alert" className="api-feedback error">{error}</p>}
      <div className="api-modal-actions"><Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancelar</Button><Button disabled={busy}>{busy ? 'Guardando...' : animal ? 'Guardar cambios' : 'Registrar animal'}</Button></div>
    </form>}
  </Modal>;
}
