import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

export function RatingStars({ value, onChange, size = 20 }: RatingStarsProps) {
  const interactive = Boolean(onChange);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="rating-stars" role={interactive ? 'radiogroup' : undefined} aria-label="Calificación">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`rating-stars__star ${star <= value ? 'rating-stars__star--filled' : ''}`}
          onClick={() => onChange?.(star)}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          <Star size={size} strokeWidth={1.5} fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}