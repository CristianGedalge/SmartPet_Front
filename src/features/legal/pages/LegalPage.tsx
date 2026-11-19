import { Link } from "react-router-dom";
import { FileText, ShieldCheck } from "lucide-react";
import legal from "../content/legal.json";

export default function LegalPage({
  document,
}: {
  document: "terminos" | "privacidad";
}) {
  const content = legal.documents[document];
  const Icon = document === "terminos" ? FileText : ShieldCheck;
  return (
    <main
      id="main-content"
      className="mx-auto max-w-4xl px-5 py-12 text-[#143d2e] sm:px-8 sm:py-16"
    >
      <nav
        aria-label="Documentos legales"
        className="mb-8 flex flex-wrap gap-3 text-sm"
      >
        <Link
          to="/terminos"
          aria-current={document === "terminos" ? "page" : undefined}
          className="rounded-lg border border-emerald-200 px-4 py-2 hover:bg-emerald-50 aria-[current=page]:bg-emerald-50"
        >
          Términos y condiciones
        </Link>
        <Link
          to="/privacidad"
          aria-current={document === "privacidad" ? "page" : undefined}
          className="rounded-lg border border-emerald-200 px-4 py-2 hover:bg-emerald-50 aria-[current=page]:bg-emerald-50"
        >
          Política de privacidad
        </Link>
      </nav>
      <Icon size={32} className="mb-5 text-emerald-700" aria-hidden="true" />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {content.title}
      </h1>
      <p className="mt-4 text-sm text-slate-500">
        Versión {legal.version} · Actualizado el {legal.updatedAt}
      </p>
      <p className="mt-7 text-lg leading-relaxed">{content.introduction}</p>
      <aside className="my-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-base leading-relaxed">
        <p>
          <strong>Responsable del servicio:</strong> {legal.responsible}.
        </p>
        <p className="mt-2">{legal.contact}</p>
      </aside>
      <article className="space-y-8">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold">{section.title}</h2>
            <p className="mt-3 text-base leading-8 text-slate-600">
              {section.body}
            </p>
          </section>
        ))}
      </article>
      <p className="mt-10 border-t border-emerald-100 pt-6 text-sm leading-relaxed text-slate-500">
        La lectura de estos documentos no crea una cuenta ni marca las casillas
        del registro. Puedes volver a tu formulario para decidir si aceptas.
      </p>
    </main>
  );
}
