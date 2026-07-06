interface RouteLineProps {
  pickup: string;
  dropoff: string;
  compact?: boolean;
}

export function RouteLine({ pickup, dropoff, compact = false }: RouteLineProps) {
  return (
    <div className={`route-line ${compact ? 'route-line--compact' : ''}`}>
      <div className="route-line__axis">
        <span className="route-line__stop route-line__stop--origin" />
        <span className="route-line__track" />
        <span className="route-line__stop route-line__stop--destination" />
      </div>
      <div className="route-line__addresses">
        <div className="route-line__address">
          <span className="route-line__label">Origen</span>
          <span className="route-line__text">{pickup}</span>
        </div>
        <div className="route-line__address">
          <span className="route-line__label">Destino</span>
          <span className="route-line__text">{dropoff}</span>
        </div>
      </div>
    </div>
  );
}