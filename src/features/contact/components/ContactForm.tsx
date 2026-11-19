import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send } from 'lucide-react';
import { contactService, type ContactInput } from '../services/contact.service';

const initialForm: ContactInput = {
  nombre: '',
  email: '',
  asunto: '',
  mensaje: '',
  sitioWeb: '',
};

const fieldClass =
  'mt-2 min-h-12 w-full rounded-xl border border-emerald-950/15 bg-white px-4 py-3 text-base text-[#143d2e] outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15';

const apiErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return 'No se pudo enviar el mensaje.';
  const message = (error.response?.data as { message?: string | string[] } | undefined)
    ?.message;
  if (Array.isArray(message)) return message[0] ?? 'Revisa los datos ingresados.';
  return message || 'No se pudo enviar el mensaje. Inténtalo nuevamente.';
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');

  const update = (field: keyof ContactInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== 'idle') {
      setStatus('idle');
      setMessage('');
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setMessage('');
    try {
      await contactService.send(form);
      setForm(initialForm);
      setStatus('success');
      setMessage('Tu mensaje fue enviado. El Equipo SmartPet te responderá pronto.');
    } catch (error) {
      setStatus('error');
      setMessage(apiErrorMessage(error));
    }
  };

  return (
    <section
      aria-labelledby="contact-form-title"
      className="mb-14 grid gap-8 rounded-[2rem] bg-[#143d2e] p-6 text-white sm:p-9 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200">
          Escríbenos
        </p>
        <h2 id="contact-form-title" className="mt-4 text-3xl font-bold">
          Envíanos un mensaje
        </h2>
        <p className="mt-4 text-base leading-8 text-emerald-50/85">
          Completa el formulario y tu consulta llegará directamente al
          administrador de SmartPet.
        </p>
      </div>
      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <label className="text-base font-semibold">
          Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={(event) => update('nombre', event.target.value)}
            minLength={2}
            maxLength={100}
            required
            autoComplete="name"
            className={fieldClass}
          />
        </label>
        <label className="text-base font-semibold">
          Correo
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            maxLength={150}
            required
            autoComplete="email"
            className={fieldClass}
          />
        </label>
        <label className="text-base font-semibold sm:col-span-2">
          Asunto
          <input
            name="asunto"
            value={form.asunto}
            onChange={(event) => update('asunto', event.target.value)}
            minLength={3}
            maxLength={120}
            required
            className={fieldClass}
          />
        </label>
        <label className="text-base font-semibold sm:col-span-2">
          Mensaje
          <textarea
            name="mensaje"
            value={form.mensaje}
            onChange={(event) => update('mensaje', event.target.value)}
            minLength={10}
            maxLength={2000}
            required
            rows={5}
            className={`${fieldClass} resize-y`}
          />
        </label>
        <label className="absolute -left-[9999px]" aria-hidden="true">
          Sitio web
          <input
            name="sitioWeb"
            value={form.sitioWeb}
            onChange={(event) => update('sitioWeb', event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-emerald-900 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-70"
          >
            <Send size={18} aria-hidden="true" />
            {status === 'loading' ? 'Enviando…' : 'Enviar mensaje'}
          </button>
          {message && (
            <p
              role={status === 'error' ? 'alert' : 'status'}
              className={`text-base ${status === 'error' ? 'text-red-200' : 'text-emerald-100'}`}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
