import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tripService } from '../services/tripService';
import { getErrorMessage } from '../services/api';
import { TripCard } from '../components/TripCard';
import { RatingStars } from '../components/RatingStars';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { Spinner } from '../components/Spinner';
import type { Trip } from '../types';

export default function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pendingTrips, setPendingTrips] = useState<Trip[]>([]);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOnId, setActingOnId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [pending, mine] = await Promise.all([
        tripService.getPendingTrips(),
        tripService.getMyDriverTrips(),
      ]);
      setPendingTrips(pending);
      setMyTrips(mine);
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos cargar tus viajes. Intenta de nuevo.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeTrip = myTrips.find((t) => t.status === 'IN_PROGRESS') ?? null;

  async function handleAccept(tripId: number) {
    setError(null);
    try {
      setActingOnId(tripId);
      await tripService.acceptTrip(tripId);
      await loadData();
      navigate(`/trips/${tripId}`);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo aceptar el viaje.'));
    } finally {
      setActingOnId(null);
    }
  }

  async function handleComplete(tripId: number) {
    setError(null);
    try {
      setActingOnId(tripId);
      await tripService.completeTrip(tripId);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo completar el viaje.'));
    } finally {
      setActingOnId(null);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="dashboard driver-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Hola, {user?.firstName}</h1>
          <RatingStars value={user?.rating ?? 0} />
        </div>
      </header>

      {error && <ErrorBanner message={error} />}

      {activeTrip && (
        <section className="active-trip">
          <h2>Viaje activo</h2>
          <TripCard trip={activeTrip} viewerRole="DRIVER" />
          <button
            className="btn btn-primary"
            onClick={() => handleComplete(activeTrip.id)}
            disabled={actingOnId === activeTrip.id}
          >
            {actingOnId === activeTrip.id ? 'Completando...' : 'Completar viaje'}
          </button>
        </section>
      )}

      <section className="pending-trips">
        <h2>Viajes disponibles</h2>
        {pendingTrips.length === 0 ? (
          <EmptyState title="No hay viajes pendientes en este momento." />
        ) : (
          <div className="trip-list">
            {pendingTrips.map((trip) => (
              <div key={trip.id} className="trip-list-item">
                <TripCard trip={trip} viewerRole="DRIVER" />
                <button
                  className="btn btn-primary"
                  onClick={() => handleAccept(trip.id)}
                  disabled={!!activeTrip || actingOnId === trip.id}
                >
                  {actingOnId === trip.id ? 'Aceptando...' : 'Aceptar'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}