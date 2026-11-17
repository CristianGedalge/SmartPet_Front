import { Link, Outlet, useLocation } from 'react-router-dom';
import { Brand } from '../components/shared/Brand';
export function AuthLayout() {
  const isRegister = useLocation().pathname === '/register';
  return <div className={'auth-shell' + (isRegister ? ' auth-register' : '')}><Brand /><div className="auth-content"><Outlet /></div><p className="auth-footer"><Link to="/adopciones" className="api-text-button">Conoce animales en adopción</Link><br/>Juntos, más cerca de casa.</p></div>;
}
