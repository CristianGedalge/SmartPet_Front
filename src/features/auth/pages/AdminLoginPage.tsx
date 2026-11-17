import { LoginForm } from '../components/LoginForm';

export default function AdminLoginPage() {
  return (
    <LoginForm
      expectedRole="ADMIN"
      title="Acceso Administrativo"
      subtitle="Ingresa con tus credenciales de administrador del sistema."
      showRegisterLink={false}
    />
  );
}
