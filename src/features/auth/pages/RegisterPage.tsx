import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Building2, UserRound, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../hooks/useAuth';
import type { TipoEstablecimiento } from '../../../types';
import { getApiErrorMessage } from '../../../utils/error.utils';
import { authService } from '../services/auth.service';
import { LocationPicker } from '../components/LocationPicker';
import { isValidLocation, type LocationCoordinates } from '../../../utils/map.utils';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const previousStep = useRef(step);
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    stepTitle.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ block: 'start' });
  }, [step]);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');

  const [nombreEstablecimiento, setNombreEstablecimiento] = useState('');
  const [tipoEstablecimiento, setTipoEstablecimiento] =
    useState<TipoEstablecimiento>('REFUGIO');
  const [direccion, setDireccion] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [ubicacion, setUbicacion] = useState<LocationCoordinates | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setError(null);
    if (step === 1) {
      setStep(2);
      return;
    }
    if (!ubicacion || !isValidLocation(ubicacion)) {
      setError('Marca la ubicación de tu establecimiento en el mapa.');
      document.querySelector<HTMLElement>('.location-map')?.focus();
      return;
    }
    setIsLoading(true);

    try {
      const response = await authService.registerEncargado({
        nombre,
        apellido,
        email,
        password,
        telefono,
        establecimiento: {
          nombre: nombreEstablecimiento,
          tipo: tipoEstablecimiento,
          direccion,
          latitud: ubicacion.latitud,
          longitud: ubicacion.longitud,
          telefono: telefonoContacto,
        },
      });

      setSession(response.access_token, response.usuario);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page registration-wizard">
      <header className="registration-heading">
        <span className="registration-badge">REGISTRO DE ENCARGADO</span>
        <h1>Un nuevo espacio para ayudar.</h1>
        <p>Crea tu cuenta y registra tu veterinaria o refugio en SmartPet.</p>
      </header>
      <section className="panel registration-card wizard-card" ref={cardRef} aria-labelledby="wizard-step-title">
        <div className="wizard-progress">
          <p aria-live="polite">Paso {step} de 2</p>
          <ol aria-label="Progreso del registro">
            <li className={step === 1 ? 'current' : 'complete'} aria-current={step === 1 ? 'step' : undefined}><span>{step === 2 ? <Check size={14} /> : '1'}</span>Tu cuenta</li>
            <li className={step === 2 ? 'current' : ''} aria-current={step === 2 ? 'step' : undefined}><span>2</span>Tu establecimiento</li>
          </ol>
          <div className="wizard-progress-track" aria-hidden="true"><span style={{ width: step === 1 ? '50%' : '100%' }} /></div>
        </div>
        <div className="registration-card-heading"><span className="registration-card-icon">{step === 1 ? <UserRound size={23} /> : <Building2 size={23} />}</span><div><h2 id="wizard-step-title" ref={stepTitle} tabIndex={-1}>{step === 1 ? 'Datos del encargado' : 'Tu establecimiento'}</h2><p>{step === 1 ? 'Primero, creemos tu cuenta personal.' : 'Completa los datos de tu veterinaria o refugio.'}</p></div></div>
        {error && <div className="api-feedback error registration-error" role="alert"><AlertCircle size={18} /><span>{error}</span></div>}
        <form onSubmit={handleSubmit} aria-busy={isLoading}>
          <fieldset disabled={isLoading} aria-label={step === 1 ? 'Datos del encargado' : 'Datos del establecimiento'}>
            {step === 1 ? <>
            <div className="registration-fields">
              <div className="registration-field-pair">
                <Input name="nombre" label="Nombre" placeholder="Juan" autoComplete="given-name" maxLength={100} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                <Input name="apellido" label="Apellido" placeholder="Pérez" autoComplete="family-name" maxLength={100} value={apellido} onChange={(e) => setApellido(e.target.value)} required />
              </div>
              <Input name="email" label="Correo electrónico" type="email" placeholder="encargado@smartpet.com" autoComplete="email" maxLength={150} value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input name="telefono" label="Teléfono personal" type="tel" placeholder="70012345" autoComplete="tel" maxLength={20} value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
              <div><Input name="password" label="Contraseña" type="password" placeholder="Crea una contraseña segura" autoComplete="new-password" minLength={8} maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} required /><p className="registration-field-hint">Usa al menos 8 caracteres.</p></div>
            </div>
            <div className="registration-account-note"><UserRound size={18} /><p>Esta será tu cuenta para gestionar el establecimiento y acompañar a las mascotas de tu comunidad.</p></div>
            </> : <>
            <div className="registration-fields">
              <div className="registration-field-pair">
                <Input name="nombreEstablecimiento" label="Nombre del establecimiento" placeholder="Refugio Huellitas" maxLength={150} value={nombreEstablecimiento} onChange={(e) => setNombreEstablecimiento(e.target.value)} required />
                <label className="api-field registration-type" htmlFor="establishment-type">Tipo<select id="establishment-type" name="tipoEstablecimiento" value={tipoEstablecimiento} onChange={(e) => setTipoEstablecimiento(e.target.value as TipoEstablecimiento)}><option value="REFUGIO">Refugio / Albergue</option><option value="VETERINARIA">Veterinaria</option></select></label>
              </div>
              <Input name="direccion" label="Dirección" placeholder="Av. Principal #123" autoComplete="street-address" maxLength={255} value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              <Input name="telefonoContacto" label="Teléfono de contacto" type="tel" placeholder="33445566" maxLength={20} value={telefonoContacto} onChange={(e) => setTelefonoContacto(e.target.value)} required />
              <LocationPicker value={ubicacion} onChange={setUbicacion} disabled={isLoading} />
            </div>
            </>}
          </fieldset>
          <div className={'wizard-actions' + (step === 1 ? ' wizard-actions-first' : '')}>
            {step === 2 && <Button type="button" variant="outline" disabled={isLoading} onClick={() => { setError(null); setStep(1); }}><ArrowLeft size={16} />Atrás</Button>}
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Creando cuenta…' : step === 1 ? 'Continuar' : 'Crear cuenta y establecimiento'}<ArrowRight size={16} /></Button>
          </div>
          {step === 2 && <p className="wizard-submit-note">Tu cuenta y tu establecimiento se crearán juntos.</p>}
        </form>
      </section>
      <p className="registration-login">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
    </div>
  );
}
