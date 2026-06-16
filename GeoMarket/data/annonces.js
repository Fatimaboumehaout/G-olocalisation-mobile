import { haversine } from '../utils/haversine';

export const ANNONCES = [
  {
    id: '1',
    titre: 'Vélo de ville',
    prix: 300,
    photo: 'https://picsum.photos/200/150?random=1',
    latitude: 35.770,
    longitude: -5.820,
    vendeur: 'Yassine',
  },
  {
    id: '2',
    titre: 'Canapé gris',
    prix: 800,
    photo: 'https://picsum.photos/200/150?random=2',
    latitude: 35.755,
    longitude: -5.840,
    vendeur: 'Fatima',
  },
  {
    id: '3',
    titre: 'iPhone 11',
    prix: 2500,
    photo: 'https://picsum.photos/200/150?random=3',
    latitude: 35.780,
    longitude: -5.810,
    vendeur: 'Karim',
  },
  {
    id: '4',
    titre: 'Table en bois',
    prix: 450,
    photo: 'https://picsum.photos/200/150?random=4',
    latitude: 35.740,
    longitude: -5.850,
    vendeur: 'Sara',
  },
  {
    id: '5',
    titre: 'Machine à laver',
    prix: 1200,
    photo: 'https://picsum.photos/200/150?random=5',
    latitude: 35.790,
    longitude: -5.800,
    vendeur: 'Ahmed',
  },
  {
    id: '6',
    titre: 'Guitare acoustique',
    prix: 600,
    photo: 'https://picsum.photos/200/150?random=6',
    latitude: 35.765,
    longitude: -5.845,
    vendeur: 'Nadia',
  },
  {
    id: '7',
    titre: 'Réfrigérateur',
    prix: 1500,
    photo: 'https://picsum.photos/200/150?random=7',
    latitude: 35.750,
    longitude: -5.825,
    vendeur: 'Omar',
  },
  {
    id: '8',
    titre: 'Trottinette électrique',
    prix: 2000,
    photo: 'https://picsum.photos/200/150?random=8',
    latitude: 35.775,
    longitude: -5.815,
    vendeur: 'Zineb',
  },
];

export function filtrerParRayon(userLocation, rayonKm) {
  return ANNONCES
    .map(annonce => ({
      ...annonce,
      distance: haversine(
        userLocation.latitude,
        userLocation.longitude,
        annonce.latitude,
        annonce.longitude
      ),
    }))
    .filter(annonce => annonce.distance <= rayonKm);
}