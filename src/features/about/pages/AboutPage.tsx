import { Link } from "react-router-dom";
import { ArrowRight, Heart, Mail, PawPrint, ShieldCheck, Users } from "lucide-react";
import legal from "../../legal/content/legal.json";

const values = [
  { icon: Heart, title: "Bienestar animal", text: "Ponemos el cuidado de perros y gatos en el centro de lo que construimos." },
  { icon: Users, title: "Comunidad", text: "Creemos en la colaboración entre ciudadanos, veterinarias y refugios para ayudar a más mascotas." },
  { icon: ShieldCheck, title: "Responsabilidad", text: "Promovemos reportes honestos, el respeto entre personas y el cuidado de la información que se comparte." },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="text-[#143d2e]">
      <section className="overflow-hidden bg-[#eff8f3]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:px-10 lg:py-24">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-emerald-700">Sobre nosotros · SmartPet</p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Conectamos personas.<br /><span className="text-emerald-700">Cuidamos mascotas.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#536e60]">Somos {legal.responsible}, el equipo detrás de una plataforma que acerca a ciudadanos, veterinarias y refugios para apoyar el bienestar animal.</p>
            <p className="mt-4 max-w-xl text-base leading-8 text-[#536e60]">Queremos que encontrar una mascota, compartir un avistamiento o conocer un compañero en adopción sea más sencillo y esté al alcance de nuestra comunidad.</p>
            <a href="#nuestro-proposito" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-emerald-800 underline underline-offset-4">Conoce nuestro propósito <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <figure className="relative">
            <img src="/images/rescue-dog.jpg" alt="Perro, parte de la comunidad que buscamos cuidar" className="aspect-[4/3] w-full rounded-[2rem] object-cover" />
            <figcaption className="relative mx-5 -mt-9 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm sm:mx-8">
              <PawPrint size={30} className="shrink-0 text-emerald-600" aria-hidden="true" />
              <p className="text-base font-semibold leading-6">Juntos, más cerca de casa.<span className="block font-normal text-[#536e60]">Cada pequeña acción cuenta.</span></p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="nuestro-proposito" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Nuestro propósito</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">La tecnología al servicio de su bienestar.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-16">
          <div className="border-l-2 border-emerald-500 pl-6"><h3 className="text-xl font-bold">Nuestra misión</h3><p className="mt-3 text-base leading-8 text-[#536e60]">Facilitar la colaboración para cuidar mascotas, difundir alertas de extravío y avistamientos y dar visibilidad a las adopciones de los establecimientos.</p></div>
          <div className="border-l-2 border-emerald-200 pl-6"><h3 className="text-xl font-bold">Nuestra visión</h3><p className="mt-3 text-base leading-8 text-[#536e60]">Construir una comunidad donde cada mascota tenga más oportunidades de regresar a casa o encontrar un hogar, con información accesible y personas dispuestas a ayudar.</p></div>
        </div>
      </section>

      <section className="border-y border-emerald-950/5 bg-[#fafcfb]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight">Lo que hacemos</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            <div><h3 className="text-xl font-bold">Acompañamos a los ciudadanos</h3><p className="mt-4 text-base leading-8 text-[#536e60]">Desde la aplicación móvil, las personas pueden registrar sus mascotas, compartir alertas y avistamientos, conversar sobre los reportes y consultar mascotas en adopción.</p><Link to="/adopciones" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-emerald-800 hover:underline">Conocer las adopciones <ArrowRight size={18} aria-hidden="true" /></Link></div>
            <div><h3 className="text-xl font-bold">Conectamos con los establecimientos</h3><p className="mt-4 text-base leading-8 text-[#536e60]">Las veterinarias y refugios cuentan con un portal web para gestionar sus resguardados y publicar mascotas disponibles para adopción, acercando su trabajo a la comunidad.</p><Link to="/establecimientos" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-emerald-800 hover:underline">Conocer el portal de establecimientos <ArrowRight size={18} aria-hidden="true" /></Link></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <h2 className="text-3xl font-bold tracking-tight">Lo que nos mueve</h2>
        <div className="mt-10 grid gap-9 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => <div key={title}><Icon size={28} className="mb-5 text-emerald-600" aria-hidden="true" /><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-base leading-8 text-[#536e60]">{text}</p></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="rounded-[2rem] bg-[#143d2e] px-6 py-10 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200">Hablemos</p>
          <h2 className="mt-4 text-3xl font-bold">Queremos escucharte.</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-emerald-50">Si tienes una consulta sobre SmartPet, una propuesta de colaboración o necesitas ayuda con tus datos, puedes escribir a nuestro equipo.</p>
          <a href="mailto:cristian.gedalge2018@gmail.com" className="mt-6 inline-flex min-h-11 max-w-full items-center gap-3 rounded-xl border border-emerald-200/30 px-4 py-3 text-base font-semibold hover:bg-white/10"><Mail size={20} className="shrink-0" aria-hidden="true" /><span className="min-w-0 break-all">cristian.gedalge2018@gmail.com</span></a>
        </div>
      </section>
    </main>
  );
}
