import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
// Importation des icônes gratuites fournies par Expo
import { Feather } from '@expo/vector-icons'; 
import useLocation from '../hooks/useLocation';
import { filtrerParRayon } from '../data/annonces';

export default function ConfigZoneScreen({ navigation }){
  const [rayon, setRayon] = useState(5);
  const [prenom, setPrenom] = useState('');
  const { location, cityName, error, loading, demanderPermission } = useLocation();

  function ouvrirParametres(){
    Linking.openSettings();
  }

  // Calcul dynamique du nombre d'annonces dans le rayon sélectionné (Style Leboncoin)
  const annoncesFiltrees = location ? filtrerParRayon(location, rayon) : [];
  const nombreAnnonces = annoncesFiltrees.length;

  if (loading){
    return (
      <View style={styles.centré}>
        <ActivityIndicator size="large" color="#534AB7" />
        <Text style={styles.texteGris}>Recherche de votre position...</Text>
      </View>
    );
  }

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

  function handleRechercher(){
    navigation.navigate('Map', {
      userLocation: location,
      rayonKm: rayon,
      annonces: annoncesFiltrees,
      buyerName: prenom || 'Acheteur',
    });
  }

  return(
    <View style={styles.container}>
      
      {/* 🚀 EN-TÊTE AVEC ICÔNE VECTORIELLE TEMPORAIRE */}
      <View style={styles.enTete}>
        <View style={styles.logoConteneur}>
          <Feather name="compass" size={32} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.appNom}>GeoMarket</Text>
          <Text style={styles.appSlogan}>Vos voisins ont des trésors</Text>
        </View>
      </View>

      {/* 👤 FORMULAIRE DE BIENVENUE */}
      <View style={styles.carteFormulaire}>
        <Text style={styles.label}>Qui cherche aujourd'hui ?</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez votre prénom..."
          placeholderTextColor="#A09E96"
          value={prenom}
          onChangeText={setPrenom}
        />
        {prenom.length > 0 && (
          <Text style={styles.messageBienvenue}>
            Ravi de vous voir, <Text style={styles.prenomHighlight}>{prenom}</Text> ! 👋
          </Text>
        )}
      </View>

      {/* 📍 MA POSITION ACTUELLE */}
      <View style={styles.cartePosition}>
        <Text style={styles.label}>Ma position actuelle</Text>
        <Text style={styles.villeTexte}>📍 {cityName}</Text>
        <Text style={styles.coordonnees}>
          {location?.latitude?.toFixed(4)}, {location?.longitude?.toFixed(4)}
        </Text>
      </View>

      {/* 🎚️ CONFIGURATION DU RAYON */}
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

        {/* 🚶‍♂️ BOUTONS RACCOURCIS (Chips style Airbnb/Vinted) */}
        <View style={styles.chipsConteneur}>
          <TouchableOpacity 
            style={[styles.chip, rayon === 2 && styles.activeChip]} 
            onPress={() => setRayon(2)}
          >
            <Text style={[styles.chipTexte, rayon === 2 && styles.activeChipTexte]}>🚶‍♂️ 2 km</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, rayon === 5 && styles.activeChip]} 
            onPress={() => setRayon(5)}
          >
            <Text style={[styles.chipTexte, rayon === 5 && styles.activeChipTexte]}>🚲 5 km</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, rayon === 15 && styles.activeChip]} 
            onPress={() => setRayon(15)}
          >
            <Text style={[styles.chipTexte, rayon === 15 && styles.activeChipTexte]}>🚗 15 km</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔍 BOUTON DE RECHERCHE DYNAMIQUE (Style Leboncoin) */}
      <TouchableOpacity style={styles.bouton} onPress={handleRechercher}>
        <Text style={styles.texteBouton}>
          Voir les {nombreAnnonces} annonce{nombreAnnonces > 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F0',
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
  enTete: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoConteneur: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#534AB7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 3,
    shadowColor: '#534AB7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  appNom: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A19',
  },
  appSlogan: {
    fontSize: 14,
    color: '#8A8880',
    fontWeight: '500',
  },
  carteFormulaire: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  input: {
    height: 48,
    borderColor: '#E2DFD8',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A19',
    backgroundColor: '#FAF9F6',
    marginTop: 8,
    fontWeight: '500',
  },
  messageBienvenue: {
    marginTop: 10,
    fontSize: 14,
    color: '#8A8880',
    fontWeight: '500',
  },
  prenomHighlight: {
    color: '#534AB7',
    fontWeight: '700',
  },
  cartePosition: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  carteRayon: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A09E96',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  villeTexte: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A19',
    marginTop: 6,
    marginBottom: 2,
  },
  coordonnees: {
    fontSize: 13,
    color: '#8A8880',
  },
  rayonTexte: {
    fontSize: 20,
    fontWeight: '700',
    color: '#534AB7',
    marginTop: 6,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  sliderLimit: {
    fontSize: 12,
    color: '#8A8880',
    fontWeight: '500',
  },
  chipsConteneur: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E2DFD8',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeChip: {
    backgroundColor: '#534AB7',
    borderColor: '#534AB7',
  },
  chipTexte: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2A',
  },
  activeChipTexte: {
    color: '#ffffff',
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