import { Star, User as UserIcon } from 'lucide-react';
import type { User } from '../types/user';

export function DriverCard({ driver }: { driver: User }) {
  return (
    <div className="driver-card">
      <div className="driver-card__avatar">
        <UserIcon size={18} strokeWidth={1.75} />
      </div>
      <div className="driver-card__info">
        <span className="driver-card__name">{driver.firstName} {driver.lastName}</span>
        <span className="driver-card__rating">
          <Star size={13} fill="currentColor" strokeWidth={0} />
          {driver.rating.toFixed(1)}
        </span>
      </div>
      <span className="driver-card__status">disponible</span>
    </div>
  );
}