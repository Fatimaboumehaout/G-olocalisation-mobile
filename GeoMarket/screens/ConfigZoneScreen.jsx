import React, { useState } from 'react';
import { Image } from 'react-native';
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
      
      {/*  EN-TÊTE AVEC ICÔNE VECTORIELLE  */}
      <View style={styles.enTete}>
      <View style={styles.logoConteneur}>
        <Image source={require('../assets/icon.png')} style={styles.logoImage} />
      </View>
      <View style={styles.texteConteneur}>
        <Text style={styles.appNom}>GeoMarket</Text>
        <Text style={styles.appSlogan}>Vos voisins ont des trésors</Text>
      </View>
    </View>

      {/*  FORMULAIRE DE BIENVENUE */}
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

      {/*  CONFIGURATION DU RAYON */}
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

        {/* BOUTONS RACCOURCIS (Chips style Airbnb/Vinted) */}
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

      {/* BOUTON DE RECHERCHE DYNAMIQUE */}
      <TouchableOpacity
        style={styles.bouton}
        activeOpacity={0.85}
        onPress={handleRechercher}
      >
        <Feather
          name="search"
          size={18}
          color="#FFFFFF"
          style={{ marginRight: 8 }}
        />

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
    backgroundColor: '#F4F4F8',
    padding: 24,
    justifyContent: 'center',
  },

  centré: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F4F4F8',
  },

  enTete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    marginBottom: 22,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  logoConteneur: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#534AB7',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 16,

    shadowColor: '#534AB7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  logoImage: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },

  texteConteneur: {
    flex: 1,
    justifyContent: 'center',
  },

  appNom: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A19',
  },

  appSlogan: {
    fontSize: 13,
    color: '#8A8880',
    marginTop: 2,
    letterSpacing: 0.2,
  },

  carteFormulaire: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: '#F0EEF9',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  cartePosition: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: '#F0EEF9',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  carteRayon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 24,

    borderWidth: 1,
    borderColor: '#F0EEF9',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#534AB7',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ECE9FF',
    backgroundColor: '#FAFAFD',
    paddingHorizontal: 16,
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A19',
  },

  messageBienvenue: {
    marginTop: 12,
    fontSize: 14,
    color: '#8A8880',
    fontWeight: '500',
  },

  prenomHighlight: {
    color: '#534AB7',
    fontWeight: '700',
  },

  villeTexte: {
    fontSize: 21,
    fontWeight: '700',
    color: '#1A1A19',
    marginTop: 8,
  },

  coordonnees: {
    marginTop: 4,
    fontSize: 13,
    color: '#8A8880',
  },

  rayonTexte: {
    fontSize: 22,
    fontWeight: '800',
    color: '#534AB7',
    marginTop: 8,
    marginBottom: 10,
  },

  slider: {
    width: '100%',
    height: 40,
  },

  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
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
    backgroundColor: '#FAFAFD',

    borderWidth: 1,
    borderColor: '#ECE9FF',

    borderRadius: 14,

    paddingVertical: 12,

    marginHorizontal: 4,

    alignItems: 'center',
  },

  activeChip: {
    backgroundColor: '#534AB7',
    borderColor: '#534AB7',

    shadowColor: '#534AB7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  chipTexte: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2A',
  },

  activeChipTexte: {
    color: '#FFFFFF',
  },

  bouton: {
    backgroundColor: '#534AB7',

    borderRadius: 18,

    paddingVertical: 18,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#534AB7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,

    elevation: 6,
  },

  texteBouton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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