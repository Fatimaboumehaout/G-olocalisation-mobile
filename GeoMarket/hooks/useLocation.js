import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demanderPermission();
  }, []);

  async function demanderPermission() {
    setLoading(true);
    setError(null);

    try {
      // 1. Demande d'autorisation GPS
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permission de localisation refusée.');
        setLoading(false);
        return;
      }

      // 2. Tenter d'abord de récupérer la dernière position connue en cache (très rapide et ne bloque pas)
      let position = await Location.getLastKnownPositionAsync({});

      // 3. Si aucune position en cache, forcer une requête GPS fraîche
      if (!position) {
        position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced, // Précision équilibrée pour éviter de bloquer
        });
      }

      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      
      setLocation(coords);

      // 4. Reverse Geocoding pour obtenir la ville
      const adresse = await Location.reverseGeocodeAsync(coords);
      if (adresse && adresse.length > 0) {
        const localite = adresse[0];
        const nomVille = localite.city || localite.subregion || localite.district || "Position détectée";
        setCityName(nomVille);
      } else {
        setCityName("Position détectée");
      }

    } catch (err) {
      console.log("Erreur GPS : ", err);
      setError("Impossible de récupérer la position. Veuillez vérifier que le GPS de votre téléphone est activé.");
    } finally {
      setLoading(false);
    }
  }

  return { location, cityName, error, loading, demanderPermission };
}