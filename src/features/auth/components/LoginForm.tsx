import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../hooks/useAuth';
import type { RolNombre } from '../../../types';
import { getApiErrorMessage } from '../../../utils/error.utils';
import { authService } from '../services/auth.service';

interface LoginFormProps {
  expectedRole: Extract<RolNombre, 'ADMIN' | 'ENCARGADO'>;
  title: string;
  subtitle: string;
  showRegisterLink?: boolean;
}

export function LoginForm({
  expectedRole,
  title,
  subtitle,
  showRegisterLink = false,
}: LoginFormProps) {
  const navigate = useNavigate();
  const { setSession, clearSession } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [roleMismatchError, setRoleMismatchError] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setRoleMismatchError(null);
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.usuario.rol !== expectedRole) {
        clearSession();
        if (expectedRole === 'ADMIN') {
          setRoleMismatchError(
            'Acceso denegado: Este portal es exclusivo para Administradores. Si eres Encargado, ingresa desde /login.',
          );
        } else if (response.usuario.rol === 'ADMIN') {
          setRoleMismatchError(
            'Acceso denegado: Las cuentas de Administrador deben iniciar sesión exclusivamente desde /admin/login.',
          );
        } else {
          setRoleMismatchError(
            'Acceso denegado: Las cuentas de Ciudadano utilizan la aplicación móvil de SmartPet.',
          );
        }
        return;
      }

      setSession(response.access_token, response.usuario);
      navigate(expectedRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard', {
        replace: true,
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            expectedRole === 'ADMIN'
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          Portal {expectedRole === 'ADMIN' ? 'Administrador' : 'Encargado'}
        </span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      {roleMismatchError && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">Portal incorrecto para tu rol</p>
            <p className="mt-0.5">{roleMismatchError}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="usuario@smartpet.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          className="w-full"
          variant={expectedRole === 'ADMIN' ? 'primary' : 'secondary'}
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
        {showRegisterLink ? (
          <p>
            ¿Aún no tienes cuenta de establecimiento?{' '}
            <Link
              to="/register"
              className="font-semibold text-emerald-600 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        ) : (
          <p>
            ¿Eres encargado de un establecimiento?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Ir al portal de Encargados
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
