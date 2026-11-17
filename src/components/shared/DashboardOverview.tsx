import { useState } from 'react';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Heart, Megaphone, PawPrint, Users, Building2, CircleCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ActivityCalendar() {
  const today = new Date();
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const start = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const title = month.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  return (
    <section className="panel calendar-panel">
      <div className="panel-heading"><h2>Próximas actividades</h2><CalendarDays size={19} /></div>
      <div className="calendar-navigation">
        <button className="icon-button" aria-label="Mes anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={19} /></button>
        <strong aria-live="polite">{title}</strong>
        <button className="icon-button" aria-label="Mes siguiente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={19} /></button>
      </div>
      <div className="calendar-grid">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}
        {Array.from({ length: start }, (_, i) => <span key={'blank-' + i} />)}
        {Array.from({ length: days }, (_, i) => {
          const date = new Date(month.getFullYear(), month.getMonth(), i + 1);
          const active = date.getTime() === selected.getTime();
          const isToday = date.toDateString() === today.toDateString();
          return <button key={i} className={'calendar-day ' + (active ? 'selected' : '') + (isToday ? ' today' : '')} aria-label={date.toLocaleDateString('es', { dateStyle: 'full' })} aria-current={isToday ? 'date' : undefined} aria-pressed={active} onClick={() => setSelected(date)}>{i + 1}</button>;
        })}
      </div>
      <p className="calendar-empty"><span />Sin actividades programadas · {selected.toLocaleDateString('es', { day: 'numeric', month: 'short' })}</p>
    </section>
  );
}

export function DashboardOverview() {
  const { user } = useAuth();
  const admin = user?.rol === 'ADMIN';
  const prefix = admin ? '/admin' : '';
  const [period, setPeriod] = useState('Mensual');
  const stats = [
    { title: 'Mascotas registradas', icon: PawPrint, caption: 'Todos los pequeños compañeros', featured: true },
    { title: 'Adopciones', icon: Heart, caption: 'Nuevas oportunidades de hogar' },
    { title: 'Reportes activos', icon: Megaphone, caption: 'La comunidad está para ayudar' },
    { title: admin ? 'Usuarios' : 'Mi establecimiento', icon: admin ? Users : Building2, caption: admin ? 'Personas que hacen la diferencia' : user?.establecimiento?.tipo === 'REFUGIO' ? 'Refugio de animales' : 'Clínica veterinaria' },
  ];
  return (
    <div className="dashboard">
      <div className="dashboard-intro"><div><p className="eyebrow">UN HOGAR PARA CADA HUELLA</p><h1>{admin ? 'Panel de bienestar animal' : user?.establecimiento?.nombre ?? 'Mi refugio'}</h1><p>{admin ? 'Una mirada a tu comunidad y a las historias que están por comenzar.' : 'Gestiona tu establecimiento y acompaña a cada mascota en su nuevo comienzo.'}</p></div><span className="welcome-pill"><span />Hola, {user?.nombre ?? 'bienvenido'}</span></div>
      <div className="stats-grid">
        {stats.map(({ title, icon: Icon, caption, featured }) => <section className="stat-card" key={title}><span className={'stat-icon ' + (featured ? 'featured' : '')}><Icon size={27} strokeWidth={1.8} /></span><div><h2>{title}</h2><strong className={!admin && title === 'Mi establecimiento' ? 'stat-name' : ''}>{!admin && title === 'Mi establecimiento' ? user?.establecimiento?.nombre ?? 'Sin vincular' : '—'}</strong><p>{caption}</p></div></section>)}
      </div>
      <div className="dashboard-columns">
        <div className="dashboard-primary">
          <section className="rescue-banner">
            <div className="banner-copy"><span className="banner-kicker"><Heart size={13} /> PEQUEÑAS HUELLAS, GRANDES HISTORIAS</span><h2>Un nuevo comienzo<br />empieza contigo.</h2><p>Detrás de cada mirada hay un compañero<br className="desktop-break" /> esperando una segunda oportunidad.</p><Link className="green-button" to={prefix + '/pets'}>Ver mascotas<ArrowRight size={18} /></Link></div>
            <div className="banner-photo"><img src="/images/rescue-dog.jpg" alt="Perro golden retriever en un entorno natural" /><span className="photo-badge"><PawPrint size={15} /> Más amor. Más hogares.</span></div>
          </section>
          <section className="panel chart-panel">
            <div className="panel-heading"><div><h2>Estado de mascotas</h2><p>Cada historia merece un final feliz.</p></div><select aria-label="Periodo de estadísticas" value={period} onChange={(event) => setPeriod(event.target.value)}><option>Mensual</option><option>Semanal</option></select></div>
            <div className="chart-empty" role="img" aria-label={'Estadísticas ' + (period === 'Mensual' ? 'mensuales' : 'semanales') + ' sin datos disponibles'}><div className="chart-grid-lines">{[4, 3, 2, 1, 0].map((v) => <span key={v}><small>{v * 10}</small><i /></span>)}</div><div className="chart-empty-message"><span><PawPrint size={24} /></span><strong>Las próximas historias se verán aquí</strong><p>Aún no hay estadísticas disponibles.</p></div></div>
            <div className="chart-axis">{(period === 'Mensual' ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'] : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']).map((label) => <span key={label}>{label}</span>)}</div>
            <div className="chart-legend"><span><i />Disponibles</span><span><i />En adopción</span></div>
          </section>
        </div>
        <div className="dashboard-secondary">
          <ActivityCalendar />
          <section className="panel details-panel"><div className="panel-heading"><h2>Tu espacio</h2><span className="small-label">SMARTPET</span></div>
            <Link className="detail-row" to={prefix + '/profile'}><span className="detail-icon"><CircleCheck size={23} /></span><span><strong>{user?.estado ? 'Cuenta activa' : 'Mi cuenta'}</strong><small>{admin ? 'Administrador de la comunidad' : 'Encargado de establecimiento'}</small></span><ArrowUpRight size={17} /></Link>
            <Link className="detail-row" to={admin ? '/admin/users' : '/profile'}><span className="detail-icon">{admin ? <Users size={23} /> : <Building2 size={23} />}</span><span><strong>{admin ? 'Nuestra comunidad' : user?.establecimiento?.nombre ?? 'Mi establecimiento'}</strong><small>{admin ? 'Gestionar usuarios' : user?.establecimiento?.direccion ?? 'Consultar mis datos'}</small></span><ArrowUpRight size={17} /></Link>
            <p className="details-note"><Heart size={14} />Gracias por ser parte de algo bueno.</p>
          </section>
        </div>
      </div>
      <p className="dashboard-footnote">Los indicadores se mostrarán cuando haya estadísticas disponibles.</p>
    </div>
  );
}
