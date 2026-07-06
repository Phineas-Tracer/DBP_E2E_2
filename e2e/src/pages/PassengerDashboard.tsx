import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tripService } from '../services/tripService';
import { getErrorMessage } from '../services/api';
import { TripCard } from '../components/TripCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { Spinner } from '../components/Spinner';
import type { Trip } from '../types';

export default function PassengerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTrips() {
      try {
        setLoading(true);
        const data = await tripService.getMyTrips();
        if (active) setTrips(data);
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'No pudimos cargar tus viajes. Intenta de nuevo.'));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTrips();
    return () => {
      active = false;
    };
  }, []);

  // Viajes activos (pendientes o en curso) primero, luego el resto por fecha descendente.
  const sortedTrips = [...trips].sort((a, b) => {
    const activeA = a.status !== 'COMPLETED' ? 0 : 1;
    const activeB = b.status !== 'COMPLETED' ? 0 : 1;
    if (activeA !== activeB) return activeA - activeB;
    return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
  });

  return (
    <div className="dashboard passenger-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Hola, {user?.firstName}</h1>
          <p className="text-muted">¿A dónde vamos hoy?</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/request-trip')}>
          Pedir viaje
        </button>
      </header>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Spinner />
      ) : sortedTrips.length === 0 ? (
        <EmptyState title="Aún no has pedido ningún viaje. Toca 'Pedir viaje' para empezar." />
      ) : (
        <div className="trip-list">
          {sortedTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} viewerRole="PASSENGER" />
          ))}
        </div>
      )}
    </div>
  );
}