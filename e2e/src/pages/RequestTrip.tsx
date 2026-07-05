import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableDrivers } from '../services/userService';
import { createTrip } from '../services/tripService';
import DriverCard from '../components/DriverCard';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';
import type { User } from '../types';

export default function RequestTrip() {
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState<User[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDrivers() {
      try {
        setLoadingDrivers(true);
        const data = await getAvailableDrivers();
        if (active) setDrivers(data);
      } catch {
        if (active) setError('No pudimos cargar los conductores disponibles.');
      } finally {
        if (active) setLoadingDrivers(false);
      }
    }

    loadDrivers();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!pickupAddress.trim() || !dropoffAddress.trim()) {
      setError('Ingresa el origen y el destino del viaje.');
      return;
    }

    try {
      setSubmitting(true);
      const trip = await createTrip({ pickupAddress, dropoffAddress });
      navigate(`/trips/${trip.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'No pudimos crear el viaje. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="request-trip">
      <h1>Pedir un viaje</h1>

      <section className="available-drivers">
        <h2>Conductores disponibles ahora</h2>
        {loadingDrivers ? (
          <Spinner />
        ) : drivers.length === 0 ? (
          <EmptyState message="No hay conductores disponibles en este momento. Puedes intentar de todas formas." />
        ) : (
          <div className="driver-list">
            {drivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        )}
      </section>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form className="trip-form" onSubmit={handleSubmit}>
        <label htmlFor="pickupAddress">Origen</label>
        <input
          id="pickupAddress"
          type="text"
          placeholder="Ej. Av. Javier Prado 100"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          disabled={submitting}
        />

        <label htmlFor="dropoffAddress">Destino</label>
        <input
          id="dropoffAddress"
          type="text"
          placeholder="Ej. Miraflores, Lima"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          disabled={submitting}
        />

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Solicitando...' : 'Confirmar viaje'}
        </button>
      </form>
    </div>
  );
}

/**
 * Interfaces asumidas:
 * - userService.getAvailableDrivers(): Promise<User[]>
 * - tripService.createTrip({ pickupAddress, dropoffAddress }): Promise<Trip>
 * - <DriverCard driver={User} />
 * - <EmptyState message={string} />
 * - <ErrorBanner message={string} onDismiss={() => void} />
 * - <Spinner />
 */
