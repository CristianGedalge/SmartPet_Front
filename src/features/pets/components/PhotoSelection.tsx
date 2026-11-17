import { useEffect, useId, useRef, useState } from 'react';
import { Check, ImagePlus, UploadCloud, X } from 'lucide-react';

function Preview({ file }: { file: File }) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    if (ref.current) ref.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return <img ref={ref} alt={file.name} className="photo-upload-preview" />;
}

interface PhotoSelectionProps {
  files: File[];
  onChange: (files: File[]) => void;
  onError: (message: string) => void;
  existing?: number;
  disabled?: boolean;
}

export function PhotoSelection({ files, onChange, onError, existing = 0, disabled = false }: PhotoSelectionProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const total = files.length + existing;
  const full = total >= 5;
  const unavailable = disabled || full;

  function select(selected: File[]) {
    if (unavailable || !selected.length) return;
    let message = '';
    if (selected.length + total > 5) {
      const available = 5 - total;
      message = 'Puedes agregar ' + available + (available === 1 ? ' foto más.' : ' fotos más.') + ' El máximo es de 5 en total.';
    } else if (selected.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      message = 'Selecciona imágenes JPG, PNG o WebP.';
    } else if (selected.some(file => file.size === 0 || file.size > 5 * 1024 * 1024)) {
      message = 'Cada foto debe contener una imagen y pesar como máximo 5 MB.';
    }
    setError(message);
    onError(message);
    if (!message) onChange([...files, ...selected]);
  }

  return <section className="photo-upload api-field-wide" aria-labelledby={id + '-title'}
    onDragOver={event => event.preventDefault()}
    onDrop={event => {
      event.preventDefault();
      setDragging(false);
      select(Array.from(event.dataTransfer.files));
    }}>
    <div className="photo-upload-heading">
      <div><h3 id={id + '-title'}>Fotografías</h3><p>Una buena foto ayuda a contar su historia.</p></div>
      <span className={'photo-upload-count' + (full ? ' is-full' : '')} aria-live="polite">{full && <Check size={13} aria-hidden="true" />}{total}/5 fotos</span>
    </div>
    <input ref={input} type="file" hidden aria-label="Seleccionar fotografías" multiple accept="image/jpeg,image/png,image/webp" disabled={unavailable}
      onChange={event => {
        const selected = Array.from(event.target.files ?? []);
        event.target.value = '';
        select(selected);
      }} />
    <button type="button" className={'photo-dropzone' + (dragging && !unavailable ? ' is-dragging' : '')}
      disabled={unavailable} aria-describedby={id + '-help' + (error ? ' ' + id + '-error' : '')}
      onClick={() => input.current?.click()}
      onDragEnter={event => { event.preventDefault(); if (!unavailable) setDragging(true); }}
      onDragLeave={event => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}>
      <span className="photo-upload-icon">{full ? <Check size={25} aria-hidden="true" /> : <UploadCloud size={27} aria-hidden="true" />}</span>
      <span className="photo-upload-title">{full ? 'Ya tienes las 5 fotos' : dragging ? 'Suelta las fotos aquí' : files.length ? '¿Otra foto de su mejor lado?' : 'Agrega fotos del animal'}</span>
      <span className="photo-upload-description">{full ? 'Puedes quitar una foto para agregar otra.' : 'Arrastra tus imágenes aquí o selecciónalas desde tu equipo.'}</span>
      {!full && <span className="photo-upload-cta"><ImagePlus size={17} aria-hidden="true" />{total ? 'Agregar más fotos' : 'Seleccionar fotos'}</span>}
    </button>
    <div className="photo-upload-help" id={id + '-help'}><span>JPG, PNG o WebP · Hasta 5 MB por foto</span><span>{existing ? existing + ' guardadas · ' + files.length + ' por agregar' : 'Al menos 1 fotografía'}</span></div>
    {error && <p id={id + '-error'} className="photo-upload-error" role="alert">{error}</p>}
    {files.length > 0 && <ul className="photo-upload-list" aria-label="Fotografías seleccionadas">
      {files.map((file, index) => <li key={file.name + '-' + file.lastModified + '-' + index} className="photo-upload-item">
        <div className="photo-upload-thumbnail"><Preview file={file} />
          <button type="button" className="photo-upload-remove" disabled={disabled} aria-label={'Quitar foto ' + (index + 1) + ': ' + file.name} title="Quitar foto" onClick={() => {
            setError('');
            onError('');
            onChange(files.filter((_, i) => i !== index));
          }}><X size={15} aria-hidden="true" /></button>
          {existing === 0 && index === 0 && <span className="photo-upload-primary">Foto principal</span>}
        </div>
        <p title={file.name}>{file.name}</p><small>{file.size < 1024 * 1024 ? Math.max(1, Math.round(file.size / 1024)) + ' KB' : (file.size / (1024 * 1024)).toFixed(1) + ' MB'}</small>
      </li>)}
    </ul>}
  </section>;
}
