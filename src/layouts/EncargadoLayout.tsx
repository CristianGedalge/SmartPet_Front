import { Heart, LayoutDashboard, Map, PawPrint, User } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/shared/AppHeader';
import { ProfileSession } from '../components/shared/ProfileSession';
import {
  AppSidebar,
  type SidebarNavItem,
} from '../components/shared/AppSidebar';

const ENCARGADO_NAV_ITEMS: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Resguardados', to: '/pets', icon: PawPrint },
  { label: 'Adopciones', to: '/adoptions', icon: Heart },
  { label: 'Mapa de calor', to: '/heatmap', icon: Map },
  { label: 'Mi Perfil', to: '/profile', icon: User },
];

export function EncargadoLayout() {
  return (
    <div className="app-shell">
      <AppSidebar
        title="SmartPet"
        badge="Portal Establecimiento"
        items={ENCARGADO_NAV_ITEMS}
      />
      <div className="app-workspace">
        <AppHeader />
        <main className="app-main">
          <ProfileSession><Outlet /></ProfileSession>
        </main>
      </div>
    </div>
  );
}
