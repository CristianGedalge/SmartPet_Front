import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Modal({ title, children, onClose, busy = false }: { title: string; children: ReactNode; onClose: () => void; busy?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className="api-modal" aria-label={title} onCancel={(event) => {
    // File inputs also emit a bubbling cancel event; only the dialog may close itself.
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    if (!busy) onClose();
  }}>
    <div className="api-modal-header"><h2>{title}</h2><button type="button" aria-label="Cerrar" className="icon-button" disabled={busy} onClick={onClose}><X size={19} /></button></div>{children}
  </dialog>;
}

