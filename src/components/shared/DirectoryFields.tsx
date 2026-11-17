import { Input } from '../ui/input';
import type { FormValues } from '../../utils/form.utils';
import { LocationPicker } from '../../features/auth/components/LocationPicker';
import { isValidLocation } from '../../utils/map.utils';
export interface DirectoryField {
  name: string; label: string; type?: 'text' | 'url' | 'number' | 'textarea' | 'select' | 'password' | 'location';
  required?: boolean; maxLength?: number; min?: number; max?: number; minLength?: number;
  options?: { value: string; label: string }[]; wide?: boolean;
}
export function DirectoryFields({ fields, values, onChange, disabled = false }: { fields: DirectoryField[]; values: FormValues; onChange: (values: FormValues) => void; disabled?: boolean }) {
  const location = { latitud: Number(values.latitud), longitud: Number(values.longitud) };
  const selectedLocation = values.latitud?.trim() && values.longitud?.trim() && isValidLocation(location) ? location : null;
  return <div className="api-form-grid">{fields.map((field) => <div className={field.wide ? 'api-field-wide' : ''} key={field.name}>
    {field.type === 'location' ? <LocationPicker disabled={disabled} required={field.required ?? false} value={selectedLocation} onChange={(next) => onChange({ ...values, latitud: next ? String(next.latitud) : '', longitud: next ? String(next.longitud) : '' })} /> :
    field.type === 'select' ? <label className="api-field">{field.label}<select required={field.required} value={values[field.name]} onChange={(event) => onChange({ ...values, [field.name]: event.target.value })}>{field.options?.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label> :
    field.type === 'textarea' ? <label className="api-field">{field.label}<textarea value={values[field.name]} maxLength={field.maxLength} onChange={(event) => onChange({ ...values, [field.name]: event.target.value })} /></label> :
    <Input name={field.name} label={field.label} type={field.type ?? 'text'} pattern={field.type === 'url' ? 'https?://.+' : undefined} required={field.required} maxLength={field.maxLength} minLength={field.minLength} min={field.min} max={field.max} step={field.type === 'number' ? 'any' : undefined} autoComplete={field.type === 'password' ? 'new-password' : undefined} value={values[field.name] ?? ''} onChange={(event) => onChange({ ...values, [field.name]: event.target.value })} />}
  </div>)}</div>;
}

