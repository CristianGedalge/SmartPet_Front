import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pencil, RefreshCw, Search, UserCheck, UserX } from 'lucide-react';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { getApiErrorMessage } from '../../utils/error.utils';
import { formError, type FormValues } from '../../utils/form.utils';
import { DirectoryFields, type DirectoryField } from './DirectoryFields';
import { Modal } from './Modal';
import { Button } from '../ui/button';

interface RecordBase { id: string; estado: boolean; }
interface Option { value: string; label: string; }
export interface DirectoryConfig<T extends RecordBase> {
  title: string; description: string; singular: string; label: (item: T) => string;
  searchText: (item: T) => string;
  columns: { title: string; render: (item: T) => ReactNode }[];
  fields: DirectoryField[];
  toForm: (item: T) => FormValues;
  list: (limit: number, offset: number, signal: AbortSignal) => Promise<T[]>;
  get: (id: string, signal?: AbortSignal) => Promise<T>;
  save: (id: string, values: FormValues) => Promise<void>;
  setStatus: (item: T) => Promise<void>;
  details?: (item: T) => ReactNode;
  filter?: { label: string; value: (item: T) => string; options?: Option[]; load?: (signal: AbortSignal) => Promise<Option[]> };
}

function EditForm<T extends RecordBase>({ record, config, onSaved, onClose, busy, setBusy }: { record: T; config: DirectoryConfig<T>; onSaved: () => void; onClose: () => void; busy: boolean; setBusy: (value: boolean) => void }) {
  const [values, setValues] = useState(() => config.toForm(record));
  const [error, setError] = useState<string | null>(null);
  return <form onSubmit={(event) => {
    event.preventDefault(); setBusy(true); setError(null);
    void config.save(record.id, values).then(onSaved).catch((err: unknown) => setError(formError(err, getApiErrorMessage(err, 'No se pudieron guardar los cambios.')))).finally(() => setBusy(false));
  }}>
    <fieldset disabled={busy}>
      <div className="api-record-summary"><strong>{config.label(record)}</strong><span className={'status-pill ' + (record.estado ? 'enabled' : 'disabled')}>{record.estado ? 'Activo' : 'Inactivo'}</span></div>
      {config.details?.(record)}
      <DirectoryFields fields={config.fields} values={values} onChange={setValues} disabled={busy} />
    </fieldset>
    {error && <p className="api-feedback error" role="alert">{error}</p>}
    <div className="api-modal-actions"><Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancelar</Button><Button type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Guardar cambios'}</Button></div>
  </form>;
}

function EditRecord<T extends RecordBase>({ id, config, onSaved, onClose }: { id: string; config: DirectoryConfig<T>; onSaved: () => void; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ attempt: number; record?: T; error?: string }>({ attempt: -1 });
  useEffect(() => {
    const controller = new AbortController();
    void config.get(id, controller.signal).then((record) => {
      if (!controller.signal.aborted) setResult({ attempt, record });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResult({ attempt, error: getApiErrorMessage(error, 'No pudimos cargar el detalle.') });
    });
    return () => controller.abort();
  }, [id, config, attempt]);
  return <Modal title={'Detalle de ' + config.singular} onClose={onClose} busy={busy}>
    {result.attempt !== attempt ? <p className="api-loading" role="status">Cargando detalle…</p> : result.record ? <EditForm record={result.record} config={config} onSaved={onSaved} onClose={onClose} busy={busy} setBusy={setBusy} /> : <div className="api-error" role="alert"><p>{result.error}</p><Button onClick={() => setAttempt((value) => value + 1)}>Reintentar</Button></div>}
  </Modal>;
}

function ConfirmStatus<T extends RecordBase>({ record, config, onSaved, onClose }: { record: T; config: DirectoryConfig<T>; onSaved: () => void; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return <Modal title={(record.estado ? 'Desactivar ' : 'Reactivar ') + config.singular} onClose={onClose} busy={busy}>
    <p className="api-confirm-copy">¿Quieres {record.estado ? 'desactivar' : 'reactivar'} a <strong>{config.label(record)}</strong>?</p>
    <p className="api-muted">{record.estado ? 'El registro conservará sus datos y quedará inactivo.' : 'El registro volverá a estar activo.'}</p>
    {error && <p className="api-feedback error" role="alert">{error}</p>}
    <div className="api-modal-actions"><Button variant="outline" disabled={busy} onClick={onClose}>Cancelar</Button><Button variant={record.estado ? 'danger' : 'primary'} disabled={busy} onClick={() => {
      setBusy(true); setError(null); void config.setStatus(record).then(onSaved).catch((err: unknown) => setError(getApiErrorMessage(err, 'No se pudo actualizar el estado.'))).finally(() => setBusy(false));
    }}>{busy ? 'Actualizando…' : record.estado ? 'Desactivar' : 'Reactivar'}</Button></div>
  </Modal>;
}

export function AdminDirectory<T extends RecordBase>({ config }: { config: DirectoryConfig<T> }) {
  const list = usePaginatedList(config.list);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [options, setOptions] = useState<Option[]>(config.filter?.options ?? []);
  const [optionError, setOptionError] = useState<string | null>(null);
  const [optionAttempt, setOptionAttempt] = useState(0);
  const [editing, setEditing] = useState<string | null>(null);
  const [changing, setChanging] = useState<T | null>(null);
  const [success, setSuccess] = useState('');
  useEffect(() => {
    const load = config.filter?.load;
    if (!load) return;
    const controller = new AbortController();
    void load(controller.signal).then((items) => { if (!controller.signal.aborted) { setOptions(items); setOptionError(null); } }).catch((error: unknown) => {
      if (!controller.signal.aborted) setOptionError(getApiErrorMessage(error, 'No pudimos cargar los roles.'));
    });
    return () => controller.abort();
  }, [config, optionAttempt]);
  const filtered = list.items.filter((item) => config.searchText(item).toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')) && (!filter || config.filter?.value(item) === filter));
  function saved() { setEditing(null); setChanging(null); setSuccess('Los cambios se guardaron correctamente.'); list.refresh(); }
  return <div className="directory-page">
    <div className="dashboard-intro"><div><p className="eyebrow">ADMINISTRACIÓN SMARTPET</p><h1>{config.title}</h1><p>{config.description}</p></div><Button variant="outline" disabled={list.loading} onClick={list.refresh}><RefreshCw size={15} />Actualizar</Button></div>
    {success && <p className="api-feedback success" role="status">{success}</p>}
    <section className="panel directory-panel">
      <div className="directory-toolbar"><label className="directory-search"><Search size={17} /><input aria-label="Buscar en esta página" placeholder="Buscar en esta página…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>{config.filter && <label className="api-field directory-filter">{config.filter.label}<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">Todos</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>}</div>
      {optionError && <p className="api-feedback error" role="alert">{optionError} <button className="api-text-button" onClick={() => setOptionAttempt((value) => value + 1)}>Reintentar roles</button></p>}
      {list.loading ? <p className="api-loading" role="status">Cargando registros…</p> : list.error ? <div className="api-error" role="alert"><p>{list.error}</p><Button variant="outline" onClick={list.refresh}>Reintentar</Button></div> : <div className="directory-table-scroll"><table className="directory-table"><thead><tr>{config.columns.map((column) => <th key={column.title} scope="col">{column.title}</th>)}<th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}>{config.columns.map((column) => <td key={column.title}>{column.render(item)}</td>)}<td><span className={'status-pill ' + (item.estado ? 'enabled' : 'disabled')}>{item.estado ? 'Activo' : 'Inactivo'}</span></td><td><div className="directory-actions"><button className="icon-button" aria-label={'Ver y editar ' + config.label(item)} title="Ver y editar" onClick={() => { setSuccess(''); setEditing(item.id); }}><Pencil size={17} /></button><button className="icon-button" aria-label={(item.estado ? 'Desactivar ' : 'Reactivar ') + config.label(item)} title={item.estado ? 'Desactivar' : 'Reactivar'} onClick={() => { setSuccess(''); setChanging(item); }}>{item.estado ? <UserX size={17} /> : <UserCheck size={17} />}</button></div></td></tr>)}</tbody></table>{!filtered.length && <p className="directory-empty">{list.items.length ? 'No hay coincidencias en esta página.' : 'No hay registros para mostrar en esta página.'}</p>}</div>}
      <div className="directory-pagination"><span>Página {list.page + 1} · {filtered.length} registros visibles</span><div><button className="icon-button" aria-label="Página anterior" disabled={list.page === 0 || list.loading} onClick={() => list.setPage((value) => value - 1)}><ChevronLeft size={19} /></button><button className="icon-button" aria-label="Página siguiente" disabled={!list.hasNext || list.loading} onClick={() => list.setPage((value) => value + 1)}><ChevronRight size={19} /></button></div></div>
    </section>
    {editing && <EditRecord key={editing} id={editing} config={config} onClose={() => setEditing(null)} onSaved={saved} />}
    {changing && <ConfirmStatus record={changing} config={config} onClose={() => setChanging(null)} onSaved={saved} />}
  </div>;
}

