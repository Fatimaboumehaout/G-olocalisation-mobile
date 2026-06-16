import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import useLocation from '../hooks/useLocation';
import { filtrerParRayon } from '../data/annonces';

export default function ConfigZoneScreen({ navigation }) {
  const [rayon, setRayon] = useState(5);
  const { location, error, loading, demanderPermission } = useLocation();

  // Cas 1 : chargement en cours
  if (loading) {
    return (
      <View style={styles.centré}>
        <ActivityIndicator size="large" color="#7F77DD" />
        <Text style={styles.texteGris}>Récupération de votre position...</Text>
      </View>
    );
  }

  // Cas 2 : permission refusée ou erreur de localisation
  if (error || !location) {
    return (
      <View style={styles.centré}>
        <Text style={styles.texteErreur}>{error || "Impossible de récupérer votre position."}</Text>
        <TouchableOpacity style={styles.bouton} onPress={demanderPermission}>
          <Text style={styles.texteBouton}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Cas 3 : position obtenue
  function handleRechercher() {
    const annonces = filtrerParRayon(location, rayon);
    navigation.navigate('Map', {
      userLocation: location,
      rayonKm: rayon,
      annonces: annonces,
    });
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titre}>Autour de moi</Text>

      <View style={styles.cartePosition}>
        <Text style={styles.label}>Ma position actuelle</Text>
        <Text style={styles.coordonnees}>
          {location?.latitude?.toFixed(4)}, {location?.longitude?.toFixed(4)}
        </Text>
      </View>

      <View style={styles.carteRayon}>
        <Text style={styles.label}>Rayon de recherche</Text>
        <Text style={styles.rayonTexte}>{rayon} km autour de moi</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={rayon}
          onValueChange={setRayon}
          minimumTrackTintColor="#7F77DD"
          maximumTrackTintColor="#D3D1C7"
          thumbTintColor="#7F77DD"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderMin}>1 km</Text>
          <Text style={styles.sliderMax}>20 km</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.bouton} onPress={handleRechercher}>
        <Text style={styles.texteBouton}>Rechercher les annonces</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1EFE8',
    padding: 24,
    justifyContent: 'center',
  },
  centré: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F1EFE8',
  },
  titre: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C2C2A',
    marginBottom: 32,
  },
  cartePosition: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  carteRayon: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    color: '#888780',
    marginBottom: 6,
  },
  coordonnees: {
    fontSize: 16,
    color: '#2C2C2A',
    fontWeight: '500',
  },
  rayonTexte: {
    fontSize: 20,
    fontWeight: '600',
    color: '#534AB7',
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderMin: {
    fontSize: 12,
    color: '#888780',
  },
  sliderMax: {
    fontSize: 12,
    color: '#888780',
  },
  texteGris: {
    marginTop: 12,
    color: '#888780',
    fontSize: 14,
  },
  texteErreur: {
    color: '#E24B4A',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  bouton: {
    backgroundColor: '#534AB7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  texteBouton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});