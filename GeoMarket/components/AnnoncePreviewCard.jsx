import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function AnnoncePreviewCard({ annonce, onClose }) {
  if (!annonce) return null;

  return (
    <View style={styles.card}>
      {/* Bouton pour fermer la carte d'aperçu */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        {/* Photo du produit */}
        <Image
          source={{ uri: annonce.photo }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Détails du produit */}
        <View style={styles.details}>
          <Text style={styles.titre} numberOfLines={1}>
            {annonce.titre}
          </Text>
          <Text style={styles.vendeur}>Vendu par {annonce.vendeur}</Text>
          
          <View style={styles.meta}>
            <Text style={styles.prix}>{annonce.prix} DH</Text>
            <Text style={styles.distance}>📍 À {annonce.distance} km</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F1EFE8',
  },
  details: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  titre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2A',
    paddingRight: 24, // Pour laisser de la place au bouton fermer
  },
  vendeur: {
    fontSize: 13,
    color: '#888780',
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  prix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#534AB7',
  },
  distance: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888780',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: '#F1EFE8',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 12,
    color: '#2C2C2A',
    fontWeight: 'bold',
  },
});
