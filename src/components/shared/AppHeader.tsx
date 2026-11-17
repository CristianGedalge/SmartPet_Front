import { Bell, Search, ArrowUpRight, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserAvatar } from './UserAvatar';

export function AppHeader() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const admin = user?.rol === 'ADMIN';
  const prefix = admin ? '/admin' : '';
  const links = [
    { label: 'Dashboard', to: prefix + '/dashboard' },
    { label: 'Mascotas', to: prefix + '/pets' },
    ...(admin ? [{ label: 'Usuarios', to: '/admin/users' }, { label: 'Establecimientos', to: '/admin/establishments' }] : []),
    { label: 'Mi perfil', to: prefix + '/profile' },
  ];
  const results = links.filter((link) => link.label.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')));
  return (
    <header className="app-header">
      <span className="header-context">Tu comunidad, unida por las mascotas</span>
      <div className="header-actions">
        <div className="search-container" onKeyDown={(event) => { if (event.key === 'Escape') setQuery(''); }}>
          <label className="header-search"><Search size={21} /><input aria-label="Buscar una sección" placeholder="Buscar una sección..." value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button className="icon-button" aria-label="Limpiar búsqueda" onClick={() => setQuery('')}><X size={15} /></button>}</label>
          {query.trim() && <div className="search-results"><p>SECCIONES</p>{results.length ? results.map((link) => <Link key={link.to} to={link.to} onClick={() => setQuery('')}>{link.label}<ArrowUpRight size={15} /></Link>) : <span>No encontramos esa sección.</span>}</div>}
        </div>
        <div className="notification-container" onKeyDown={(event) => { if (event.key === 'Escape') setNotificationsOpen(false); }}>
          <button className={'icon-button notification-button ' + (notificationsOpen ? 'selected' : '')} aria-label="Notificaciones" aria-expanded={notificationsOpen} aria-controls="notifications-panel" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={23} strokeWidth={1.8} /></button>
          {notificationsOpen && <section id="notifications-panel" className="notification-panel" aria-label="Notificaciones"><div><strong>Notificaciones</strong><button className="icon-button" aria-label="Cerrar notificaciones" onClick={() => setNotificationsOpen(false)}><X size={17} /></button></div><span className="notification-empty-icon"><Bell size={25} /></span><h3>Todo al día</h3><p>No tienes notificaciones nuevas.</p></section>}
        </div>
        <Link className="header-avatar" to={prefix + '/profile'} aria-label="Ver mi perfil"><UserAvatar /></Link>
      </div>
    </header>
  );
}
