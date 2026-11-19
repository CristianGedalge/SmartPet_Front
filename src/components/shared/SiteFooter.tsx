import { Link, useLocation } from "react-router-dom";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "./Brand";
import { ContactForm } from "../../features/contact/components/ContactForm";

export function SiteFooter() {
  const pathname = useLocation().pathname;
  const establishment = pathname === "/establecimientos";
  const businessHome = pathname === "/";
  return (
    <footer id="contacto" className="scroll-mt-28 border-t border-emerald-950/5 bg-[#eff8f3] text-[#204d3d]">
      <div className="mx-auto max-w-7xl px-5 pb-7 pt-14 sm:px-8 lg:px-10">
        {businessHome && <ContactForm />}
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.35fr] lg:gap-12">
          <div>
            <Link
              to="/"
              aria-label="SmartPet, volver al inicio"
              className="inline-flex w-44"
            >
              <Brand />
            </Link>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-[#536e60]">
              Una comunidad que conecta personas, veterinarias y refugios.
              Juntos, más cerca de casa.
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm font-medium">
              <Heart size={17} aria-hidden="true" />
              Cada pequeña acción cuenta.
            </p>
          </div>
          <nav aria-label="Comunidad">
            <h2 className="mb-4 text-base font-bold">Descubre SmartPet</h2>
            <ul className="space-y-3 text-base text-[#536e60]">
              <li>
                <Link to="/sobre-nosotros" className="hover:text-emerald-800 hover:underline">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-emerald-800 hover:underline"
                  href="/#como-funciona"
                >
                  Cómo funciona
                </a>
              </li>
              <li>
                <Link
                  className="hover:text-emerald-800 hover:underline"
                  to="/adopciones"
                >
                  Mascotas en adopción
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-emerald-800 hover:underline"
                  href="/#comunidad"
                >
                  La experiencia móvil
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-800 hover:underline"
                  href="/#preguntas"
                >
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Establecimientos">
            <h2 className="mb-4 text-base font-bold">
              Veterinarias y refugios
            </h2>
            <ul className="space-y-3 text-base text-[#536e60]">
              <li>
                <a
                  className="hover:text-emerald-800 hover:underline"
                  href="/establecimientos"
                >
                  Conoce el portal
                </a>
              </li>
              {establishment ? <>
                <li><Link className="hover:text-emerald-800 hover:underline" to="/register">Registrar establecimiento</Link></li>
                <li><Link className="hover:text-emerald-800 hover:underline" to="/login">Ingresar al portal</Link></li>
              </> : <li><a className="hover:text-emerald-800 hover:underline" href="/#contacto">Contactar al equipo</a></li>}
            </ul>
          </nav>
          <section aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title" className="mb-4 text-base font-bold">
              Contacto
            </h2>
            <address className="space-y-4 text-base not-italic text-[#536e60]">
              <a
                href="tel:+59177074673"
                className="flex items-start gap-3 hover:text-emerald-800 hover:underline"
              >
                <Phone size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
                +591 77074673
              </a>
              <a
                href="mailto:cristian.gedalge2018@gmail.com"
                className="flex items-start gap-3 break-all hover:text-emerald-800 hover:underline"
              >
                <Mail size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
                cristian.gedalge2018@gmail.com
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.%20Beni%2C%20calle%2012%2C%20Santa%20Cruz%2C%20Bolivia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-emerald-800 hover:underline"
              >
                <MapPin size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>Av. Beni, calle 12, Santa Cruz, Bolivia</span>
              </a>
            </address>
          </section>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-emerald-950/10 pt-6 text-sm text-[#536e60]">
          <nav
            aria-label="Información legal"
            className="flex w-full flex-wrap gap-5 pb-2"
          >
            <Link to="/terminos" className="hover:underline">
              Términos y condiciones
            </Link>
            <Link to="/privacidad" className="hover:underline">
              Política de privacidad
            </Link>
          </nav>
          <p>© {new Date().getFullYear()} SmartPet.</p>
          <p>Por más historias que terminen en un hogar.</p>
        </div>
      </div>
    </footer>
  );
}
