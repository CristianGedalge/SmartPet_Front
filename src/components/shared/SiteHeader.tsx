import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Brand } from "./Brand";
import { useAuth } from "../../hooks/useAuth";

export function SiteHeader() {
  const establishment = useLocation().pathname === "/establecimientos";
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const { user, isAuthenticated } = useAuth();
  const hasPortal = isAuthenticated && user && user.rol !== "CIUDADANO";
  const portal = hasPortal
    ? user.rol === "ADMIN"
      ? "/admin/dashboard"
      : "/dashboard"
    : "/login";
  const close = () => setOpen(false);
  return (
    <header
      className="sticky top-0 z-30 border-b border-emerald-950/5 bg-white/95 backdrop-blur-md"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          close();
          toggle.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex min-h-24 max-w-7xl flex-wrap items-center justify-between gap-x-6 px-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          aria-label="SmartPet, inicio"
          onClick={close}
          className="inline-flex w-40 shrink-0 sm:w-48"
        >
          <Brand />
        </Link>
        <button
          ref={toggle}
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="public-navigation"
          onClick={() => setOpen((value) => !value)}
          className="flex size-11 items-center justify-center rounded-xl text-emerald-950 hover:bg-emerald-50 lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="public-navigation"
          aria-label="Navegación principal"
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-2 pb-5 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:pb-0`}
        >
          {(establishment
            ? [{ to: "/establecimientos#funciones", label: "Funciones" }, { to: "/establecimientos#comenzar", label: "Cómo empezar" }]
            : [{ to: "/#como-funciona", label: "Servicios" }, { to: "/sobre-nosotros", label: "Sobre nosotros" }, { to: "/#contacto", label: "Contacto" }]
          ).map(({ to, label }) => to.includes("#") ? <a key={to} href={to} onClick={close} className="rounded-lg py-3 text-base text-slate-600 hover:text-emerald-700">{label}</a> : <Link key={to} to={to} onClick={close} className="rounded-lg py-3 text-base text-slate-600 hover:text-emerald-700">{label}</Link>)}
          <Link
            to={establishment ? portal : "/establecimientos"}
            onClick={close}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-700 px-5 py-2.5 text-base font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
          >
            {establishment ? (hasPortal ? "Ir a mi panel" : "Ingresar al portal") : "Para establecimientos"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
