import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  return (
    <LoginForm
      expectedRole="ENCARGADO"
      title="Bienvenido a SmartPet"
      subtitle="Ingresa con tu cuenta de encargado para gestionar mascotas y establecimientos."
      showRegisterLink={true}
    />
  );
}
