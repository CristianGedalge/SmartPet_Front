import { Building2, CreditCard, LayoutDashboard, ListTree, Map, PawPrint, ShieldCheck, User, Users } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/shared/AppHeader';
import { ProfileSession } from '../components/shared/ProfileSession';
import {
  AppSidebar,
  type SidebarNavItem,
} from '../components/shared/AppSidebar';

const ADMIN_NAV_ITEMS: SidebarNavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Usuarios', to: '/admin/users', icon: Users },
  { label: 'Roles', to: '/admin/roles', icon: ShieldCheck },
  { label: 'Especies', to: '/admin/species', icon: ListTree },
  { label: 'Planes', to: '/admin/plans', icon: CreditCard },
  { label: 'Establecimientos', to: '/admin/establishments', icon: Building2 },
  { label: 'Mascotas', to: '/admin/pets', icon: PawPrint },
  { label: 'Mapa de calor', to: '/admin/heatmap', icon: Map },
  { label: 'Mi Perfil', to: '/admin/profile', icon: User },
];

export function AdminLayout() {
  return (
    <div className="app-shell">
      <AppSidebar
        title="SmartPet"
        badge="Panel Admin"
        items={ADMIN_NAV_ITEMS}
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
