import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import AnnoncePreviewCard from '../components/AnnoncePreviewCard';

export default function MapScreen({ route, navigation }) {
  // Récupérer les paramètres passés depuis ConfigZoneScreen
  const { userLocation, rayonKm, annonces } = route.params || {};
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);

  // Coordonnées par défaut au cas où
  const latitude = userLocation?.latitude || 35.770;
  const longitude = userLocation?.longitude || -5.820;
  const listAnnonces = annonces || [];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        // Ferme la modale si on clique ailleurs sur la carte
        onPress={() => setSelectedAnnonce(null)}
      >
        {/* Marqueur pour la position de l'utilisateur */}
        <Marker
          coordinate={{ latitude, longitude }}
          title="Ma position"
          pinColor="#534AB7"
        />

        {/* Cercle représentant le rayon de recherche */}
        <Circle
          center={{ latitude, longitude }}
          radius={rayonKm * 1000} // Converti en mètres
          strokeWidth={2}
          strokeColor="rgba(83, 74, 183, 0.4)"
          fillColor="rgba(83, 74, 183, 0.1)"
        />

        {/* Marqueurs pour les objets en vente */}
        {listAnnonces.map((annonce) => (
          <Marker
            key={annonce.id}
            coordinate={{
              latitude: annonce.latitude,
              longitude: annonce.longitude,
            }}
            title={annonce.titre}
            description={`${annonce.prix} DH`}
            onPress={(e) => {
              // Empêche la propagation du clic vers la carte (ce qui fermerait la modale)
              e.stopPropagation();
              setSelectedAnnonce(annonce);
            }}
          />
        ))}
      </MapView>

      {/* Affichage de la carte d'aperçu en bas si un marqueur est sélectionné */}
      {selectedAnnonce && (
        <AnnoncePreviewCard
          annonce={selectedAnnonce}
          onClose={() => setSelectedAnnonce(null)}
        />
      )}

      {/* Bouton pour revenir à la configuration */}
      <TouchableOpacity
        style={styles.boutonRetour}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.texteRetour}>Modifier la zone</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  boutonRetour: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  texteRetour: {
    color: '#2C2C2A',
    fontWeight: '600',
    fontSize: 14,
  },
});