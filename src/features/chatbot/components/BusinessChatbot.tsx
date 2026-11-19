import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";

const panelId = "smartpet-business-chatbot";

export function BusinessChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      requestAnimationFrame(() => toggleRef.current?.focus());
    };

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [isOpen]);

  const closePanel = () => {
    setIsOpen(false);
    requestAnimationFrame(() => toggleRef.current?.focus());
  };

  return (
    <aside className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {isOpen && (
        <section
          id={panelId}
          role="dialog"
          aria-labelledby="business-chatbot-title"
          className="w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-[0_24px_70px_rgba(19,78,58,0.22)]"
        >
          <header className="flex items-center justify-between gap-4 bg-[#075e4a] px-5 py-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15">
                <Bot size={24} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 id="business-chatbot-title" className="truncate text-base font-bold">
                  Asistente SmartPet
                </h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-emerald-50">
                  <Sparkles size={14} aria-hidden="true" />
                  Próximamente
                </p>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={closePanel}
              aria-label="Cerrar asistente de SmartPet"
              className="grid size-10 shrink-0 place-items-center rounded-full text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={21} aria-hidden="true" />
            </button>
          </header>

          <div className="bg-[#f5faf7] px-5 py-6">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                <MessageCircle size={19} aria-hidden="true" />
              </span>
              <p className="rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-[#365b4c] shadow-sm ring-1 ring-emerald-950/5">
                ¡Hola! Muy pronto podré orientarte sobre SmartPet, adopciones y
                los servicios disponibles para nuestra comunidad.
              </p>
            </div>
          </div>

          <div className="border-t border-emerald-950/10 bg-white p-4">
            <p className="mb-3 text-center text-xs font-medium text-[#607b6f]">
              Estamos preparando esta experiencia para ti.
            </p>
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-950/10 bg-slate-50 p-2">
              <input
                type="text"
                disabled
                aria-label="Mensaje para el asistente"
                placeholder="El chat estará disponible pronto"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-500 placeholder:text-slate-500 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled
                aria-label="Enviar mensaje"
                className="grid size-10 shrink-0 cursor-not-allowed place-items-center rounded-xl bg-emerald-700 text-white opacity-45"
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      )}

      <button
        ref={toggleRef}
        type="button"
        aria-label={isOpen ? "Cerrar asistente de SmartPet" : "Abrir asistente de SmartPet"}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        className="group relative grid size-14 place-items-center rounded-full bg-[#009c78] text-white shadow-[0_14px_35px_rgba(0,156,120,0.32)] transition hover:-translate-y-0.5 hover:bg-[#007f63] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 sm:size-16"
      >
        <span className="absolute -right-0.5 -top-0.5 size-3.5 rounded-full border-2 border-white bg-amber-400" aria-hidden="true" />
        {isOpen ? <X size={25} aria-hidden="true" /> : <MessageCircle size={27} aria-hidden="true" />}
      </button>
    </aside>
  );
}
