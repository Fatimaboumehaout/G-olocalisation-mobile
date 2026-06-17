import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import AnnoncePreviewCard from '../components/AnnoncePreviewCard';

export default function MapScreen({ route, navigation }) {
  const { userLocation, rayonKm, annonces } = route.params || {};
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [mapType, setMapType] = useState('standard'); // 👈 standard / satellite / hybrid

  const [positionReelle, setPositionReelle] = useState({
    latitude: userLocation?.latitude || 35.770,
    longitude: userLocation?.longitude || -5.820,
  });

  const mapRef = useRef(null);
  const listAnnonces = annonces || [];

  const userCoords = useRef(
    new AnimatedRegion({
      latitude: positionReelle.latitude,
      longitude: positionReelle.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;

  useEffect(() => {
    let subscription;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (pos) => {
          const { latitude, longitude } = pos.coords;
          userCoords.timing({ latitude, longitude, duration: 500, useNativeDriver: false }).start();
          setPositionReelle({ latitude, longitude });
        }
      );
    })();
    return () => subscription?.remove();
  }, []);

  const recentrerCarte = () => {
    mapRef.current?.animateToRegion(
      { latitude: positionReelle.latitude, longitude: positionReelle.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      600
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}   // 👈 Utilise Google Maps (pas Apple Maps)
        mapType={mapType}             // 👈 Style dynamique
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsTraffic={false}
        showsBuildings={true}
        showsIndoors={true}
        initialRegion={{
          latitude: positionReelle.latitude,
          longitude: positionReelle.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={() => setSelectedAnnonce(null)}
      >
        <Circle
          center={positionReelle}
          radius={rayonKm * 1000}
          strokeWidth={2}
          strokeColor="rgba(83, 74, 183, 0.4)"
          fillColor="rgba(83, 74, 183, 0.1)"
        />

        <Marker.Animated
          coordinate={userCoords}
          anchor={{ x: 0.5, y: 0.5 }}
          title="Ma position"
        >
          <View style={styles.markerContainer}>
            <View style={styles.halo} />
            <View style={styles.pointBleu} />
          </View>
        </Marker.Animated>

        {listAnnonces.map((annonce) => (
          <Marker
            key={annonce.id}
            coordinate={{ latitude: annonce.latitude, longitude: annonce.longitude }}
            title={annonce.titre}
            description={`${annonce.prix} DH`}
            onPress={(e) => { e.stopPropagation(); setSelectedAnnonce(annonce); }}
          />
        ))}
      </MapView>

      {selectedAnnonce && (
        <AnnoncePreviewCard annonce={selectedAnnonce} onClose={() => setSelectedAnnonce(null)} />
      )}

      {/* Bouton retour */}
      <TouchableOpacity style={styles.boutonRetour} onPress={() => navigation.goBack()}>
        <Text style={styles.texteRetour}>← Modifier la zone</Text>
      </TouchableOpacity>

      {/* 👇 Boutons de type de carte (Standard / Satellite / Hybrid) */}
      <View style={styles.mapTypeContainer}>
        {['standard', 'satellite', 'hybrid'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.mapTypeBtn, mapType === type && styles.mapTypeBtnActif]}
            onPress={() => setMapType(type)}
          >
            <Text style={[styles.mapTypeTexte, mapType === type && styles.mapTypeTexteActif]}>
              {type === 'standard' ? '🗺️' : type === 'satellite' ? '🛰️' : '🌍'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouton GPS recentrage */}
      <TouchableOpacity style={styles.boutonGPS} onPress={recentrerCarte}>
        <Text style={styles.iconeGPS}>⊕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { ...StyleSheet.absoluteFillObject },

  markerContainer: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute', width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(66, 133, 244, 0.2)',
    borderWidth: 1, borderColor: 'rgba(66, 133, 244, 0.3)',
  },
  pointBleu: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#4285F4',
    borderWidth: 2.5, borderColor: '#fff',
    elevation: 4,
    shadowColor: '#4285F4', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5, shadowRadius: 4,
  },

  boutonRetour: {
    position: 'absolute', top: 20, left: 20,
    backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 20, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4,
  },
  texteRetour: { color: '#2C2C2A', fontWeight: '600', fontSize: 14 },

  // 👇 Sélecteur de type de carte
  mapTypeContainer: {
    position: 'absolute', top: 20, right: 20,
    flexDirection: 'column', gap: 8,
  },
  mapTypeBtn: {
    backgroundColor: '#fff', width: 42, height: 42,
    borderRadius: 21, alignItems: 'center', justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4,
  },
  mapTypeBtnActif: {
    backgroundColor: '#534AB7',
  },
  mapTypeTexte: { fontSize: 20 },
  mapTypeTexteActif: { fontSize: 20 },

  boutonGPS: {
    position: 'absolute', bottom: 40, right: 20,
    backgroundColor: '#fff', width: 48, height: 48,
    borderRadius: 24, alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4,
  },
  iconeGPS: { fontSize: 26, color: '#534AB7', lineHeight: 30 },
});