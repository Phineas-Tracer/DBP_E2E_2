import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Role, Trip } from '../types';
import { StatusBadge } from '../components/StatusBadge';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TripCard({ trip, viewerRole }: { trip: Trip; viewerRole: Role }) {
  const navigate = useNavigate();
  const counterpart = viewerRole === 'PASSENGER' ? trip.driver : trip.passenger;
  const counterpartLabel = viewerRole === 'PASSENGER' ? 'Conductor' : 'Pasajero';

  return (
    <button className="trip-card" onClick={() => navigate(`/trips/${trip.id}`)}>
      <div className="trip-card__main">
        <div className="trip-card__row">
          <span className="trip-card__id">#{trip.id}</span>
          <StatusBadge status={trip.status} />
        </div>
        <p className="trip-card__addresses">
          <span>{trip.pickupAddress}</span>
          <span className="trip-card__arrow">→</span>
          <span>{trip.dropoffAddress}</span>
        </p>
        <div className="trip-card__meta">
          <span>{formatDate(trip.requestedAt)}</span>
          <span className="trip-card__dot">·</span>
          <span>
            {counterpartLabel}: {counterpart ? `${counterpart.firstName} ${counterpart.lastName}` : 'sin asignar'}
          </span>
        </div>
      </div>
      <ChevronRight size={20} strokeWidth={1.75} className="trip-card__chevron" />
    </button>
  );
}