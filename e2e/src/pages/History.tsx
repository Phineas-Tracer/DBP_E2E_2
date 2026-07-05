import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getTrips, getMyTrips } from '../services/tripService';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';
import type { Trip, TripStatus } from '../types';

type StatusFilter = 'ALL' | TripStatus;

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('ALL');

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        setLoading(true);
        const data = user?.role === 'DRIVER' ? await getMyTrips() : await getTrips();
        if (active) setTrips(data);
      } catch {
        if (active) setError('No pudimos cargar tu historial.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      active = false;
    };
  }, [user?.role]);

  const filteredTrips = useMemo(() => {
    const sorted = [...trips].sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
    if (filter === 'ALL') return sorted;
    return sorted.filter((t) => t.status === filter);
  }, [trips, filter]);

  return (
    <div className="history">
      <header className="history-header">
        <h1>Historial de viajes</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value as StatusFilter)}>
          <option value="ALL">Todos</option>
          <option value="PENDING">Pendientes</option>
          <option value="IN_PROGRESS">En curso</option>
          <option value="COMPLETED">Completados</option>
        </select>
      </header>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <Spinner />
      ) : filteredTrips.length === 0 ? (
        <EmptyState message="No hay viajes que coincidan con este filtro." />
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Estado</th>
              <th>Fecha</th>
              {user?.role === 'DRIVER' ? <th>Pasajero</th> : <th>Conductor</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)} className="clickable-row">
                <td>#{trip.id}</td>
                <td>{trip.pickupAddress}</td>
                <td>{trip.dropoffAddress}</td>
                <td>
                  <StatusBadge status={trip.status} />
                </td>
                <td>{new Date(trip.requestedAt).toLocaleString()}</td>
                <td>
                  {user?.role === 'DRIVER'
                    ? `${trip.passenger.firstName} ${trip.passenger.lastName}`
                    : trip.driver
                    ? `${trip.driver.firstName} ${trip.driver.lastName}`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/**
 * Interfaces asumidas:
 * - useAuth() -> { user: User | null }
 * - tripService.getTrips(): Promise<Trip[]>     (pasajero)
 * - tripService.getMyTrips(): Promise<Trip[]>   (conductor)
 * - <StatusBadge status={TripStatus} />
 * - <EmptyState message={string} />
 * - <ErrorBanner message={string} onDismiss={() => void} />
 * - <Spinner />
 */
