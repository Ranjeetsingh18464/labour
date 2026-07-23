import { useState, useEffect } from 'react';

export function useGeolocation(options = {}) {
  const [state, setState] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation is not supported', loading: false }));
      return;
    }

    const success = (position) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const error = (err) => {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    };

    const watchId = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
