import { useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/button';
function Preview({file}:{file:File}) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {const url=URL.createObjectURL(file);if(ref.current) ref.current.src=url;return () => URL.revokeObjectURL(url);},[file]);
  return <img ref={ref} alt={file.name} className="rescue-photo" />;
}
export function PhotoSelection({files,onChange,onError,existing=0,disabled=false}:{files:File[];onChange:(files:File[])=>void;onError:(message:string)=>void;existing?:number;disabled?:boolean}) {
  return <div className="api-field api-field-wide"><span>Fotografías (1-5 en total, hasta 5 MB por foto)</span>
    <input type="file" aria-label="Seleccionar fotografías" multiple accept="image/jpeg,image/png,image/webp" disabled={disabled || files.length+existing >= 5} onChange={event => {
      const selected=Array.from(event.target.files ?? []);event.target.value='';
      if(selected.length+files.length+existing>5) {onError('Puedes conservar un máximo de 5 fotos.');return;}
      if(selected.some(file => file.size === 0 || file.size>5*1024*1024 || !['image/jpeg','image/png','image/webp'].includes(file.type))) {onError('Elige fotos JPG, PNG o WebP de hasta 5 MB.');return;}
      onChange([...files,...selected]);
    }} />
    <div className="rescue-photo-grid">{files.map((file,index) => <div key={index}><Preview file={file}/><Button type="button" variant="outline" disabled={disabled} onClick={()=>onChange(files.filter((_,i)=>i!==index))}>Quitar foto {index+1}</Button></div>)}</div>
  </div>;
}
