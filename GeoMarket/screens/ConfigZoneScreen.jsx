import React, { useState } from 'react';
import {
    View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking, // Pour rediriger vers les paramètres du téléphone
} from 'react-native';
import Slider from '@react-native-community/slider';
import useLocation from '../hooks/useLocation';
import { filtrerParRayon } from '../data/annonces';

export default function ConfigZoneScreen({ navigation }){
  const [rayon, setrayon] = useState(5);
  // Récupération de cityName depuis hook
  const { location,cityName,error, loading, demanderPermission }= useLocation();

  //Redirection vers les paramètres du système si la permission est refusée
  function ouvrirParametres(){
    Linking.openSettings();
  }

  //cas 1 : chargement en cours 
  if (loading){
    return (
      <View style={styles.centré}>
        <ActivityIndicator size="large" color="#534AB7" />
        <Text style={styles.texteGris}>Recherche de votre position...</Text>
      </View>
    );
  }

  // cas 2 : Erreur de permission ou GPS désactivé
  if(error || !location){
    return(
      <View style={styles.centré}>
        <Text style={styles.iconeErreur}>📍</Text>
        <Text style={styles.texteErreur}>{error || "Position indisponible"}</Text>
        
        <TouchableOpacity style={styles.bouton} onPress={demanderPermission}>
          <Text style={styles.texteBouton}>Réessayer la connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boutonLien} onPress={ouvrirParametres}>
          <Text style={styles.texteBoutonLien}>Autoriser dans les réglages</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // cas 3 : Succès, on peut rechercher
  function handleRechercher(){
    const annonces = filtrerParRayon(location,rayon);
    navigation.navigate('Map',{
      useLocation: location,
      rayonKm:rayon,
      annonces:annonces,
    });
  }
  return(
    <View style={styles.container}>
      <Text style={styles.titre}>Autour de moi</Text>
      {/* Carte Position Actuelle Améliorée */}
      <View style={styles.cartePosition}>
        <Text style={styles.label}>Ma position actuelle</Text>
        <Text style={styles.villeTexte}>📍 {cityName}</Text>
        <Text style={styles.coordonnees}>
          {location?.latitude?.toFixed(4)}, {location?.longitude?.toFixed(4)}
        </Text>
      </View>
      {/* Carte Sélection du Rayon */}
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
          minimumTrackTintColor="#534AB7"
          maximumTrackTintColor="#E2DFD8"
          thumbTintColor="#534AB7"
        />
        
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLimit}>1 km</Text>
          <Text style={styles.sliderLimit}>20 km</Text>
        </View>
      </View>
      {/* Bouton de recherche */}
      <TouchableOpacity style={styles.bouton} onPress={handleRechercher}>
        <Text style={styles.texteBouton}>Rechercher les annonces</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F0', // Fond légèrement gris-beige crème
    padding: 24,
    justifyContent: 'center',
  },
  centré: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F7F6F0',
  },
  titre: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A19',
    marginBottom: 32,
    textAlign: 'left',
  },
  cartePosition: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  carteRayon: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A09E96',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  villeTexte: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A19',
    marginBottom: 4,
  },
  coordonnees: {
    fontSize: 14,
    color: '#8A8880',
    fontFamily: 'System',
  },
  rayonTexte: {
    fontSize: 22,
    fontWeight: '700',
    color: '#534AB7', // Couleur violet principal
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLimit: {
    fontSize: 12,
    color: '#8A8880',
    fontWeight: '500',
  },
  texteGris: {
    marginTop: 16,
    color: '#8A8880',
    fontSize: 16,
    fontWeight: '500',
  },
  iconeErreur: {
    fontSize: 50,
    marginBottom: 16,
  },
  texteErreur: {
    color: '#D9383A',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  bouton: {
    backgroundColor: '#534AB7',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#534AB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  texteBouton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  boutonLien: {
    marginTop: 16,
    padding: 12,
  },
  texteBoutonLien: {
    color: '#534AB7',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});