import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PublicOnlyGuard() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.rol === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
        replace
      />
    );
  }

  return <Outlet />;
}
