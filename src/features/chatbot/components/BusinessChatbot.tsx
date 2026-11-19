import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import {
  assistantErrorMessage,
  assistantService,
  type AssistantMessage,
} from "../services/assistant.service";

const panelId = "smartpet-business-chatbot";
const welcome =
  "Hola. Puedo orientarte sobre SmartPet, las adopciones y lo que puedes hacer desde la web o la app.";

export function BusinessChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      requestAnimationFrame(() => toggleRef.current?.focus());
    };

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [isOpen]);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }, [messages, sending, error, isOpen]);

  const closePanel = () => {
    setIsOpen(false);
    requestAnimationFrame(() => toggleRef.current?.focus());
  };

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contenido = draft.trim();
    if (!contenido || sending) return;

    const history = [...messages, { rol: "USUARIO" as const, contenido }];
    setMessages(history);
    setDraft("");
    setError("");
    setSending(true);
    try {
      const { respuesta } = await assistantService.ask(history);
      setMessages((current) => [
        ...current,
        { rol: "ASISTENTE", contenido: respuesta },
      ]);
    } catch (requestError) {
      setMessages((current) => current.slice(0, -1));
      setDraft(contenido);
      setError(assistantErrorMessage(requestError));
    } finally {
      setSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <aside className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {isOpen && (
        <section
          id={panelId}
          role="dialog"
          aria-labelledby="business-chatbot-title"
          className="flex max-h-[min(32rem,calc(100dvh-7.5rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-[0_24px_70px_rgba(19,78,58,0.22)]"
        >
          <header className="flex shrink-0 items-center justify-between gap-4 bg-[#075e4a] px-5 py-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15">
                <Bot size={24} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 id="business-chatbot-title" className="truncate text-base font-bold">
                  Asistente SmartPet
                </h2>
                <p className="mt-0.5 text-sm text-emerald-50">Orientación del sitio</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closePanel}
              aria-label="Cerrar asistente de SmartPet"
              className="grid size-10 shrink-0 place-items-center rounded-full text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={21} aria-hidden="true" />
            </button>
          </header>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 space-y-3 overflow-y-auto bg-[#f5faf7] px-5 py-6"
          >
            <MessageBubble role="ASISTENTE" text={welcome} />
            {messages.map((message, index) => (
              <MessageBubble
                key={`${message.rol}-${index}`}
                role={message.rol}
                text={message.contenido}
              />
            ))}
            {sending && (
              <p className="text-sm text-[#607b6f]" role="status">
                Escribiendo…
              </p>
            )}
          </div>

          <form onSubmit={send} className="shrink-0 border-t border-emerald-950/10 bg-white p-4">
            {error && (
              <p role="alert" className="mb-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-950/10 bg-slate-50 p-2">
              <input
                ref={inputRef}
                type="text"
                value={draft}
                maxLength={1500}
                disabled={sending}
                onChange={(event) => setDraft(event.target.value)}
                aria-label="Mensaje para el asistente"
                placeholder="Escribe tu consulta"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[#143d2e] outline-none placeholder:text-slate-500 disabled:cursor-wait"
              />
              <button
                type="submit"
                disabled={sending || draft.trim().length === 0}
                aria-label="Enviar mensaje"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        ref={toggleRef}
        type="button"
        aria-label={isOpen ? "Cerrar asistente de SmartPet" : "Abrir asistente de SmartPet"}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        className="relative grid size-14 place-items-center rounded-full bg-[#009c78] text-white shadow-[0_14px_35px_rgba(0,156,120,0.32)] transition hover:-translate-y-0.5 hover:bg-[#007f63] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 sm:size-16"
      >
        {isOpen ? <X size={25} aria-hidden="true" /> : <MessageCircle size={27} aria-hidden="true" />}
      </button>
    </aside>
  );
}

function MessageBubble({ role, text }: { role: "USUARIO" | "ASISTENTE"; text: string }) {
  const own = role === "USUARIO";
  return (
    <div className={`flex items-start gap-3 ${own ? "flex-row-reverse" : ""}`}>
      {!own && (
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
          <MessageCircle size={19} aria-hidden="true" />
        </span>
      )}
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          own
            ? "rounded-tr-md bg-[#075e4a] text-white"
            : "rounded-tl-md bg-white text-[#365b4c] ring-1 ring-emerald-950/5"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
