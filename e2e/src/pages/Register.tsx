import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Radio } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';
import { ErrorBanner } from '../components/ErrorBanner';
import type { RegisterPayload } from '../types/errorManagers';

export default function RegisterPage() {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterPayload>({ defaultValues: { role: 'PASSENGER' } });

  const role = watch('role');

  async function onSubmit(values: RegisterPayload) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const user = await doRegister(values);
      navigate(user.role === 'PASSENGER' ? '/passenger' : '/driver', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'No pudimos crear tu cuenta'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card__brand">
          <Radio size={22} strokeWidth={2} />
          <span>despacho</span>
        </div>
        <h1 className="auth-card__title">Crea tu cuenta</h1>
        <p className="auth-card__subtitle">Elige cómo quieres usar la app.</p>

        {serverError && <ErrorBanner message={serverError} />}

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="role-toggle" role="radiogroup" aria-label="Selecciona tu rol">
            <button
              type="button"
              className={`role-toggle__option ${role === 'PASSENGER' ? 'role-toggle__option--active' : ''}`}
              onClick={() => setValue('role', 'PASSENGER')}
            >
              Pasajero
            </button>
            <button
              type="button"
              className={`role-toggle__option ${role === 'DRIVER' ? 'role-toggle__option--active' : ''}`}
              onClick={() => setValue('role', 'DRIVER')}
            >
              Conductor
            </button>
          </div>

          <div className="form__row">
            <div className="form__field">
              <label htmlFor="firstName">Nombre</label>
              <input id="firstName" {...register('firstName', { required: 'Requerido' })} />
              {errors.firstName && <span className="form__error">{errors.firstName.message}</span>}
            </div>
            <div className="form__field">
              <label htmlFor="lastName">Apellido</label>
              <input id="lastName" {...register('lastName', { required: 'Requerido' })} />
              {errors.lastName && <span className="form__error">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form__field">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              {...register('email', { required: 'El correo es requerido' })}
            />
            {errors.email && <span className="form__error">{errors.email.message}</span>}
          </div>

          <div className="form__field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />
            {errors.password && <span className="form__error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={isSubmitting}>
            {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-card__footer">
          ¿Ya tienes cuenta? <Link to="/login">Ingresa</Link>
        </p>
      </div>
    </div>
  );
}