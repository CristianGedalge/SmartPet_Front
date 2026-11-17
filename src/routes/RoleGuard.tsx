import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { RolNombre } from '../types';

interface RoleGuardProps {
  allowedRoles: RolNombre[];
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={isAdminRoute ? '/admin/login' : '/login'}
        state={{ from: location }}
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.rol)) {
    const redirectPath =
      user.rol === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
