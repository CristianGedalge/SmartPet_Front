import type { LucideIcon } from 'lucide-react';
import { ChevronDown, ChevronLeft, ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Brand } from './Brand';
import { UserAvatar } from './UserAvatar';

export interface SidebarNavItem { label: string; to: string; icon: LucideIcon; }
interface AppSidebarProps { title: string; badge: string; items: SidebarNavItem[]; }

export function AppSidebar({ title, badge, items }: AppSidebarProps) {
  const { user, clearSession } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('smartpet-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });
  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    setAccountOpen(false);
    try {
      localStorage.setItem('smartpet-sidebar-collapsed', String(next));
    } catch {
      // The sidebar remains usable when browser storage is unavailable.
    }
  }
  const profile = user?.rol === 'ADMIN' ? '/admin/profile' : '/profile';
  function logout() {
    const destination = user?.rol === 'ADMIN' ? '/admin/login' : '/login';
    clearSession();
    void navigate(destination, { replace: true });
  }
  return (
    <>
      <button className="mobile-menu icon-button" aria-label="Abrir navegación" aria-expanded={open} aria-controls="app-sidebar" onClick={() => setOpen(true)}><Menu size={23} /></button>
      {open && <button className="sidebar-backdrop" aria-label="Cerrar navegación" onClick={() => setOpen(false)} />}
      <aside id="app-sidebar" className={'app-sidebar ' + (open ? 'is-open ' : '') + (collapsed ? 'is-collapsed' : '')} aria-label={title} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); setAccountOpen(false); } }}>
        <div className="sidebar-brand"><Brand /><button className="sidebar-close icon-button" aria-label="Cerrar navegación" onClick={() => setOpen(false)}><X size={20} /></button></div>
        <button type="button" className="sidebar-collapse-toggle" aria-label={collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'} title={collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'} aria-expanded={!collapsed} aria-controls="sidebar-navigation" onClick={toggleCollapsed}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <p className="sidebar-caption">{badge}</p>
        <nav id="sidebar-navigation" className="sidebar-nav" aria-label="Navegación principal">
          {items.map(({ icon: Icon, ...item }) => (
            <NavLink key={item.to} to={item.to} aria-label={item.label} onClick={() => { setOpen(false); setAccountOpen(false); }} className={({ isActive }) => 'sidebar-link ' + (isActive ? 'active' : '')}>
              <Icon size={22} strokeWidth={1.8} /><span className="sidebar-link-label" aria-hidden="true">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-help"><span className="help-paw">♡</span><p>Juntos, más cerca de casa.</p><span>Cada pequeño gesto cuenta.</span></div>
        <div className="sidebar-account">
          {accountOpen && <div className="account-dropdown"><NavLink to={profile} onClick={() => { setOpen(false); setAccountOpen(false); }}>Ver mi perfil</NavLink><button onClick={logout}><LogOut size={16} />Cerrar sesión</button></div>}
          <button className="account-button" aria-label={`Menú de cuenta de ${user?.nombre ?? 'usuario'}`} aria-expanded={accountOpen} onClick={() => setAccountOpen(!accountOpen)}>
            <UserAvatar /><span className="account-label"><strong>{user?.nombre} {user?.apellido}</strong><small>{user?.rol === 'ADMIN' ? 'Administrador' : 'Encargado'}</small></span><ChevronDown size={17} />
          </button>
        </div>
      </aside>
    </>
  );
}
