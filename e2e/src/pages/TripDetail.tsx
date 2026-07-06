import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTripPolling } from '../hooks/useTripPooling';
import { tripService } from '../services/tripService';
import { getErrorMessage } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { RouteLine } from '../components/RouteLine';
import { RatingStars } from '../components/RatingStars';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { Spinner } from '../components/Spinner';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const tripId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const { user } = useAuth();

  const { trip, isLoading, error, refetch } = useTripPolling(tripId);

  const [completing, setCompleting] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (isLoading && !trip) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!trip) return <EmptyState title="No encontramos este viaje." />;

  // Capturamos `trip` ya narrowed a no-null en una constante: los closures de
  // abajo (handleComplete, handleRate) no heredan el narrowing del guard.
  const currentTrip = trip;

  const isPassenger = user?.role === 'PASSENGER';
  const isDriver = user?.role === 'DRIVER';
  const isAssignedDriver = isDriver && trip.driver?.id === user?.id;

  async function handleComplete() {
    setActionError(null);
    try {
      setCompleting(true);
      await tripService.completeTrip(currentTrip.id);
      await refetch();
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo completar el viaje.'));
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
      await tripService.rateTrip(currentTrip.id, {
        rating: ratingValue,
        comment: comment.trim() || undefined,
      });
      await refetch();
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo enviar la calificación.'));
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

      {actionError && <ErrorBanner message={actionError} />}

      {/* Vista pasajero: datos del conductor */}
      {isPassenger && (
        <section className="driver-info">
          <h2>Conductor</h2>
          {trip.driver ? (
            <div>
              <p>
                {trip.driver.firstName} {trip.driver.lastName}
              </p>
              <RatingStars value={trip.driver.rating} />
            </div>
          ) : (
            <EmptyState title="Buscando conductor..." />
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
        <EmptyState title="Viaje completado. ¡Buen trabajo!" />
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
          <RatingStars value={trip.passengerRating} />
          {trip.ratingComment && <p>{trip.ratingComment}</p>}
        </section>
      )}
    </div>
  );
}