import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../services/api';
import { tripService } from '../services/tripService';
import type { Trip } from '../types/trips';

const POLL_INTERVAL_MS = 4000;
const ACTIVE_STATUSES = new Set(['PENDING', 'IN_PROGRESS']);

export function useTripPolling(tripId: number | undefined) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchTrip = useCallback(async (silent = false) => {
    if (!tripId) return;
    if (!silent) setIsLoading(true);
    try {
      const data = await tripService.getTripById(tripId);
      setTrip(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar el viaje'));
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTrip();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [tripId]);

  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (trip && ACTIVE_STATUSES.has(trip.status)) {
      intervalRef.current = window.setInterval(() => fetchTrip(true), POLL_INTERVAL_MS);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [trip, fetchTrip]);

  return { trip, isLoading, error, refetch: () => fetchTrip(false), setTrip };
}