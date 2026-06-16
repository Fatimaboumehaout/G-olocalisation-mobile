import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demanderPermission();
  }, []);

  async function demanderPermission() {
    setLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setError('Permission refusée. Veuillez autoriser l accès à votre position.');
      setLoading(false);
      return;
    }

    const position = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    setLoading(false);
  }

  return { location, error, loading, demanderPermission };
}