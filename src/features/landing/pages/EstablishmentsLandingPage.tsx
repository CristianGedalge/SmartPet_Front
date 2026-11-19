import { Link } from "react-router-dom";
import { ArrowRight, Building2, Heart, MapPin, PawPrint } from "lucide-react";

const features = [
  { icon: PawPrint, title: "Resguardados en un solo lugar", text: "Registra fichas, características y fotografías de los animales que cuida tu establecimiento." },
  { icon: Heart, title: "Más visibilidad para las adopciones", text: "Publica mascotas disponibles y gestiona sus adopciones desde tu portal." },
  { icon: MapPin, title: "Conoce lo que sucede alrededor", text: "Consulta el mapa de calor de alertas y avistamientos para conocer los reportes de la comunidad." },
];

export default function EstablishmentsLandingPage() {
  return (
    <main id="main-content" className="text-[#143d2e]">
      <section className="bg-[#eff8f3]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:px-10 lg:py-24">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-700"><Building2 size={19} aria-hidden="true" />Para veterinarias y refugios</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Ustedes cuidan.<br /><span className="text-emerald-700">SmartPet los acompaña.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#536e60]">Organiza tus resguardados, comparte sus historias y gestiona las publicaciones de adopción. Un espacio pensado para quienes los cuidan cada día.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-800">Registrar establecimiento <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link to="/login" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-700 px-6 py-3 text-base font-semibold text-emerald-800 hover:bg-white">Ya tengo una cuenta</Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <img src="/images/rescue-dog.jpg" alt="Perro al que podemos ayudar a encontrar un hogar" className="h-72 w-full object-cover object-[50%_40%] sm:h-80" />
            <div className="p-7"><p className="text-xl font-bold">De un resguardo a una nueva oportunidad.</p><p className="mt-3 text-base leading-7 text-[#536e60]">Mantén su información organizada y acerca a cada mascota a las personas que quieren conocerla.</p></div>
          </div>
        </div>
      </section>
      <section id="funciones" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Tu trabajo, mejor conectado</p>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Más tiempo para lo que importa.</h2>
        <div className="mt-10 grid gap-9 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="border-l-2 border-emerald-200 pl-6"><Icon size={28} className="mb-5 text-emerald-600" aria-hidden="true" /><h3 className="text-xl font-bold">{title}</h3><p className="mt-4 text-base leading-8 text-[#536e60]">{text}</p></article>)}</div>
      </section>
      <section id="comenzar" className="scroll-mt-28 bg-[#fafcfb]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <h2 className="text-3xl font-bold">Tu establecimiento en SmartPet</h2>
          <ol className="mt-9 grid gap-9 md:grid-cols-3">
            {[
              ["Crea tu cuenta", "Completa los datos del encargado y de tu veterinaria o refugio, y selecciona su ubicación en el mapa."],
              ["Registra tus resguardados", "Añade sus datos y fotografías. Registrar la ficha y publicarla para adopción son pasos separados."],
              ["Comparte nuevas oportunidades", "Publica las adopciones disponibles para que la comunidad pueda conocerlas y contactar a tu establecimiento."],
            ].map(([title, text], index) => <li key={title}><p className="mb-3 text-sm font-semibold text-emerald-700">Paso {index + 1}</p><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-base leading-8 text-[#536e60]">{text}</p></li>)}
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] bg-[#143d2e] p-7 text-white sm:p-12"><h2 className="text-3xl font-bold">Un lugar para quienes ayudan.</h2><p className="mt-4 max-w-2xl text-base leading-8 text-emerald-50">Da el primer paso y conecta el trabajo de tu establecimiento con la comunidad SmartPet.</p><Link to="/register" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-white px-6 py-3 text-base font-bold text-emerald-900 hover:bg-emerald-50">Crear mi cuenta de encargado</Link></div>
      </section>
    </main>
  );
}
