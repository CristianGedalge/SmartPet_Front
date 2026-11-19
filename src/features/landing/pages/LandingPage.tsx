import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  ChevronDown,
  Heart,
  HeartHandshake,
  MapPin,
  MessageCircle,
  PawPrint,
  Search,
  Smartphone,
} from "lucide-react";

const primaryLink =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-800";
const sectionLabel =
  "mb-4 text-sm font-bold uppercase tracking-[.16em] text-emerald-700";
const features = [
  {
    icon: MapPin,
    title: "Una mirada puede reunirlos",
    text: "Las alertas y los avistamientos ayudan a compartir dónde y cuándo fue vista una mascota.",
  },
  {
    icon: Heart,
    title: "Un hogar, una nueva historia",
    text: "Conoce las publicaciones de adopción de veterinarias y refugios de la comunidad.",
  },
  {
    icon: HeartHandshake,
    title: "Cuidar es un trabajo en equipo",
    text: "Ciudadanos y establecimientos conectados para acompañar a quienes más lo necesitan.",
  },
];
const questions = [
  {
    question: "¿Necesito una cuenta para ver las adopciones?",
    answer:
      "No. Puedes explorar el catálogo público y consultar el contacto del establecimiento. El proceso de adopción se coordina directamente con la veterinaria o el refugio responsable.",
  },
  {
    question: "Soy ciudadano, ¿dónde registro a mi mascota?",
    answer:
      "Las funciones para ciudadanos están en la aplicación móvil: ficha de mascotas, alertas, avistamientos, búsqueda por foto y conversaciones relacionadas con los reportes. El portal web está pensado para establecimientos y administración.",
  },
  {
    question: "¿Quién puede registrar un establecimiento?",
    answer:
      "El encargado de una veterinaria o un refugio puede crear su cuenta junto con los datos y la ubicación de su establecimiento. Desde su portal podrá gestionar los resguardados y las publicaciones de adopción.",
  },
  {
    question: "¿Una coincidencia por foto confirma que es mi mascota?",
    answer:
      "No. La búsqueda visual muestra posibles coincidencias entre las fotografías de los avistamientos. Revisa también la fecha, la ubicación y las características del animal, y conversa con quien publicó el reporte.",
  },
];

export default function LandingPage() {
  useEffect(() => {
    if (!window.location.hash) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main id="main-content" className="text-[#143d2e]">
      <section className="relative overflow-hidden bg-[linear-gradient(120deg,#fff_50%,#f0faf5)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.08fr_1fr] lg:gap-12 lg:px-10 lg:pb-24 lg:pt-16">
          <div className="max-w-2xl">
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
              <PawPrint size={17} aria-hidden="true" />
              SmartPet · Bienestar animal, en comunidad
            </p>
          <h1 className="text-[clamp(2.25rem,4.2vw,3.75rem)] font-extrabold leading-[1.07] tracking-[-.055em]">
              Tecnología que conecta.
              <br />
              <span className="text-emerald-700">Bienestar que nos une.</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#5d7467]">
              Conectamos ciudadanos, veterinarias y refugios con herramientas
              para cuidar mascotas, compartir información y crear nuevas oportunidades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/sobre-nosotros" className={primaryLink}>
                <Heart size={19} aria-hidden="true" />
                Conoce a SmartPet
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-950/15 bg-white px-5 py-3 text-base font-semibold hover:bg-emerald-50"
              >
                Descubre SmartPet
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-[#5d7467]">
              <HeartHandshake size={18} aria-hidden="true" />
              Personas, veterinarias y refugios, más cerca.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:pb-5 lg:pl-6">
            <div
              className="absolute -bottom-1 -right-4 left-12 top-8 rounded-[2.5rem] bg-[#d7f1e4]"
              aria-hidden="true"
            />
            <img
              src="/images/rescue-dog.jpg"
              alt="Un perro golden retriever sostiene una flor en el hocico"
              width="1000"
              height="1603"
              fetchPriority="high"
              className="relative h-[430px] w-full rounded-[2rem] object-cover object-[50%_49%] sm:h-[520px] lg:h-[560px]"
            />
            <div className="absolute bottom-6 left-3 right-3 flex items-center gap-4 rounded-2xl border border-white/70 bg-white/95 p-5 shadow-lg shadow-emerald-950/5 sm:bottom-9 sm:left-0 sm:right-10">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Heart size={23} aria-hidden="true" />
              </span>
              <div>
                <p className="text-base font-bold">
                  Hay historias que empiezan con una mirada.
                </p>
                <p className="mt-1 text-sm text-[#5d7467]">
                  La próxima puede ser la tuya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="scroll-mt-28 border-y border-emerald-950/5"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <p className={sectionLabel}>Pequeñas acciones, grandes cambios</p>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Una comunidad. Muchas formas de ayudar.
          </h2>
          <div className="mt-10 grid gap-9 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="border-l-2 border-emerald-100 pl-6"
              >
                <Icon
                  size={28}
                  className="mb-5 text-emerald-600"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold leading-snug">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#5d7467]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="comunidad" className="scroll-mt-28 bg-[#f6faf8]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:px-10">
          <div
            className="mx-auto w-full max-w-sm rounded-[2.7rem] border-[8px] border-[#153e2f] bg-white p-5 shadow-xl shadow-emerald-950/10"
            aria-label="Vista ilustrativa de las funciones de la aplicación móvil"
          >
            <div
              className="mx-auto mb-6 h-1.5 w-16 rounded-full bg-emerald-950/15"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-emerald-700">
              Tu comunidad, contigo
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">
              Cada huella importa.
            </p>
            <div className="relative mt-5 overflow-hidden rounded-2xl bg-emerald-50">
              <img
                src="/images/rescue-dog.jpg"
                alt=""
                width="1000"
                height="1603"
                loading="lazy"
                className="h-44 w-full object-cover object-[50%_43%]"
              />
              <span className="absolute bottom-3 left-3 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold">
                Siempre en tu corazón
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {[
                {
                  icon: PawPrint,
                  label: "La ficha de tu mascota",
                  hint: "Sus datos y fotografías",
                },
                {
                  icon: Search,
                  label: "Posibles coincidencias",
                  hint: "Búsqueda entre avistamientos",
                },
                {
                  icon: MessageCircle,
                  label: "Conecta con la comunidad",
                  hint: "Conversa sobre los reportes",
                },
              ].map(({ icon: Icon, label, hint }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-[#f4f9f6] p-3"
                >
                  <Icon
                    size={22}
                    className="shrink-0 text-emerald-700"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="mt-1 text-sm text-[#5d7467]">{hint}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-[#5d7467]">
              Vista ilustrativa de la experiencia móvil
            </p>
          </div>
          <div>
            <p className={sectionLabel}>Para quienes los quieren</p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Tu mascota es familia.
              <br />
              Su comunidad también.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#5d7467]">
              Desde la aplicación móvil, guarda su ficha, comparte una alerta si
              se extravía y reporta los animales que veas en tu camino.
            </p>
            <ul className="mt-7 space-y-5">
              {[
                {
                  icon: Camera,
                  title: "Busca con una fotografía",
                  text: "Compara fotos de tu perro o gato con los avistamientos y revisa las posibles coincidencias.",
                },
                {
                  icon: MapPin,
                  title: "Cada detalle ayuda",
                  text: "Consulta la fecha y el lugar de un avistamiento para conocer mejor su contexto.",
                },
                {
                  icon: MessageCircle,
                  title: "Conversa con quien lo vio",
                  text: "El chat conecta a los ciudadanos alrededor de una alerta o un avistamiento.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <Icon
                    size={23}
                    className="mt-1 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-[#5d7467]">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-7 inline-flex items-center gap-2 rounded-xl border border-emerald-950/10 px-4 py-3 text-sm text-[#536e60]">
              <Smartphone size={18} className="shrink-0" aria-hidden="true" />
              Estas funciones se utilizan desde la app móvil.
            </p>
          </div>
        </div>
      </section>

      <section id="establecimientos" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-8 lg:px-10">
        <p className={sectionLabel}>Una comunidad que crece contigo</p>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div><h2 className="text-3xl font-bold">Conoce a SmartPet</h2><p className="mt-5 text-lg leading-8 text-[#5d7467]">Somos un equipo que construye herramientas para acercar a las personas y apoyar el bienestar animal. Conoce nuestro propósito y los valores que nos guían.</p><Link to="/sobre-nosotros" className="mt-6 inline-flex min-h-12 items-center font-semibold text-emerald-800 underline underline-offset-4">Sobre nosotros</Link></div>
          <div className="rounded-3xl bg-[#e6f5ec] p-7"><h2 className="text-3xl font-bold">¿Cuidas desde una veterinaria o refugio?</h2><p className="mt-5 text-lg leading-8 text-[#5d7467]">Descubre el espacio de SmartPet dedicado a los encargados y las herramientas para acompañar el trabajo de tu establecimiento.</p><Link to="/establecimientos" className={`${primaryLink} mt-6`}>Conocer el portal de establecimientos</Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#123d2d] px-6 py-14 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[.15em] text-emerald-200">
              Adoptar cambia una historia
            </p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Tal vez tu próximo gran encuentro tenga cuatro patas.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-emerald-100/85">
              Explora las publicaciones de nuestra comunidad y conoce al
              establecimiento que acompaña cada adopción.
            </p>
          </div>
          <Link
            to="/adopciones"
            className="mt-8 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-[#123d2d] hover:bg-emerald-50 lg:mt-0"
          >
            <PawPrint size={20} aria-hidden="true" />
            Explorar adopciones
          </Link>
        </div>
      </section>

      <section
        id="preguntas"
        className="mx-auto max-w-3xl scroll-mt-28 px-5 pb-24 sm:px-8"
      >
        <p className={`${sectionLabel} text-center`}>Resolvemos tus dudas</p>
        <h2 className="mb-9 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Antes de dar el primer paso.
        </h2>
        <div className="divide-y divide-emerald-950/10">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  size={21}
                  className="shrink-0 text-emerald-700 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-4 pr-5 text-base leading-relaxed text-[#5d7467]">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
