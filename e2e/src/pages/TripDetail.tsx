import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTripPolling } from '../hooks/useTripPooling';
import { completeTrip, rateTrip } from '../services/tripService';
import StatusBadge from '../components/StatusBadge';
import RouteLine from '../components/RouteLine';
import RatingStars from '../components/RatingStars';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const tripId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { trip, loading, error, refetch } = useTripPolling(tripId);

  const [completing, setCompleting] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (loading && !trip) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!trip) return <EmptyState message="No encontramos este viaje." />;

  const isPassenger = user?.role === 'PASSENGER';
  const isDriver = user?.role === 'DRIVER';
  const isAssignedDriver = isDriver && trip.driver?.id === user?.id;

  async function handleComplete() {
    setActionError(null);
    try {
      setCompleting(true);
      await completeTrip(trip.id);
      await refetch();
    } catch (err: any) {
      setActionError(err?.response?.data?.error ?? 'No se pudo completar el viaje.');
    } finally {
      setCompleting(false);
    }
  }

  async function handleRate() {
    setActionError(null);
    if (ratingValue < 1) {
      setActionError('Selecciona una calificación de 1 a 5 estrellas.');
      return;
    }
    try {
      setSubmittingRating(true);
      await rateTrip(trip.id, { rating: ratingValue, comment: comment.trim() || undefined });
      await refetch();
    } catch (err: any) {
      setActionError(err?.response?.data?.error ?? 'No se pudo enviar la calificación.');
    } finally {
      setSubmittingRating(false);
    }
  }

  return (
    <div className="trip-detail">
      <button className="btn-link" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <header className="trip-detail-header">
        <h1>Viaje #{trip.id}</h1>
        <StatusBadge status={trip.status} />
      </header>

      <RouteLine pickup={trip.pickupAddress} dropoff={trip.dropoffAddress} />

      {actionError && <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />}

      {/* Vista pasajero: datos del conductor */}
      {isPassenger && (
        <section className="driver-info">
          <h2>Conductor</h2>
          {trip.driver ? (
            <div>
              <p>
                {trip.driver.firstName} {trip.driver.lastName}
              </p>
              <RatingStars value={trip.driver.rating} readOnly />
            </div>
          ) : (
            <EmptyState message="Buscando conductor..." />
          )}
        </section>
      )}

      {/* Vista conductor: datos del pasajero */}
      {isDriver && (
        <section className="passenger-info">
          <h2>Pasajero</h2>
          <p>
            {trip.passenger.firstName} {trip.passenger.lastName}
          </p>
          <p className="text-muted">{trip.passenger.email}</p>
        </section>
      )}

      {/* Conductor asignado puede completar el viaje en curso */}
      {isAssignedDriver && trip.status === 'IN_PROGRESS' && (
        <button className="btn btn-primary" onClick={handleComplete} disabled={completing}>
          {completing ? 'Completando...' : 'Completar viaje'}
        </button>
      )}

      {/* Resumen tras completar (vista conductor) */}
      {isAssignedDriver && trip.status === 'COMPLETED' && (
        <EmptyState message="Viaje completado. ¡Buen trabajo!" />
      )}

      {/* Pasajero califica un viaje completado sin calificación */}
      {isPassenger && trip.status === 'COMPLETED' && trip.passengerRating === null && (
        <section className="rate-trip">
          <h2>Califica tu viaje</h2>
          <RatingStars value={ratingValue} onChange={setRatingValue} />
          <textarea
            placeholder="Comentario (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleRate} disabled={submittingRating}>
            {submittingRating ? 'Enviando...' : 'Enviar calificación'}
          </button>
        </section>
      )}

      {/* Ya calificado */}
      {isPassenger && trip.passengerRating !== null && (
        <section className="rate-trip">
          <h2>Tu calificación</h2>
          <RatingStars value={trip.passengerRating} readOnly />
          {trip.ratingComment && <p>{trip.ratingComment}</p>}
        </section>
      )}
    </div>
  );
}

/**
 * Interfaces asumidas:
 * - useAuth() -> { user: User | null }
 * - useTripPolling(tripId: number) -> { trip: Trip | null, loading: boolean, error: string | null, refetch: () => Promise<void> }
 *   (debe hacer polling internamente cada 3-5s mientras trip.status sea PENDING o IN_PROGRESS)
 * - tripService.completeTrip(id): Promise<Trip>
 * - tripService.rateTrip(id, { rating, comment? }): Promise<Trip>
 * - <StatusBadge status={TripStatus} />
 * - <RouteLine pickup={string} dropoff={string} />
 * - <RatingStars value={number} onChange?={(n:number)=>void} readOnly?={boolean} />
 * - <EmptyState message={string} />
 * - <ErrorBanner message={string} onDismiss?={() => void} />
 * - <Spinner />
 *
 * Nota: si tu hook se llama distinto (revisa "useTripPooling.ts" en tu árbol,
 * parece tener un typo respecto a "Polling"), ajusta el import de la línea 4.
 */
