import type { TripStatus } from '../types/trips';

const STATUS_META: Record<TripStatus, { label: string; className: string }> = {
  PENDING: { label: 'Buscando conductor', className: 'status-badge--pending' },
  IN_PROGRESS: { label: 'En curso', className: 'status-badge--progress' },
  COMPLETED: { label: 'Completado', className: 'status-badge--completed' },
};

export function StatusBadge({ status }: { status: TripStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`status-badge ${meta.className}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {meta.label}
    </span>
  );
}