import { useState,useEffect } from 'react';
import *as Location from 'expo-location';

export default function useLocation(){
  const [location,setLocation] = useState(null);
  const [cityName,setCityName] = useState(null);
  const [error,setError] = useState(null);
  cont [loading,setLoading] = useState(true);

  useEffect(()=>{
    demanderPermission();
  },[]);

  async function demanderPermission() {
    setLoading(true);
    setError(null);

    try {
      //1. Demande d'autorisation GPS
      const { statut } = await Location.requestForegroundPermissionsAsync();

      if (sattut !== 'granted'){
        setError('Permission de localisation refusée.');
        setLoading(false);
        return;
      }

      //2. Récupération de la position (avec gestion d'erreur si le gps de l'appareil est désactivé)
      const position = await Location.getCurrentPositionAsync({
        accuracy:Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(coords);

      //3. Reverse Geocoding : Traduire les coordonnées en nom de ville/Quartier
      const adresse = await Location.reverseGeocodeAsync(coords);
      if(adresse && adresse.length > 0){
        const localite = adresse[0];
        //Récupère a ville, ou à défaut le district ou la région
        const nomVille = localite.city || localite.subregion || localite.district || "Position détectée";
        setCityName(nomVille);
      }else{
        setCityName("position détectée");
      }

    } catch (err){
      console.log(err);
      setError("Impossible de récupérer la position . Vérifierz que votre GPS est activé.");
    }finally{
      setLoading(false);
    }
  }
    return { location, cityName, error, loading, demanderPermission };
}