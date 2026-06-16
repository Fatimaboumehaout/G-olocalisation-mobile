import { haversine } from '../utils/haversine';

export const ANNONCES = [
  {
    id: '1',
    titre: 'VTT Rockrider 520 très bon état',
    prix: 1800,
    photo: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=80',
    latitude: 35.7725, // Proche du centre-ville
    longitude: -5.8120,
    vendeur: 'Yassine',
  },
  {
    id: '2',
    titre: 'Canapé d\'angle convertible gris',
    prix: 3800,
    photo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
    latitude: 35.7590, // Quartier Iberia
    longitude: -5.8260,
    vendeur: 'Fatima-Zahra',
  },
  {
    id: '3',
    titre: 'iPhone 13 Pro Max - 128 Go',
    prix: 6500,
    photo: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80',
    latitude: 35.7780, // Quartier de la Plage (Malabata)
    longitude: -5.7980,
    vendeur: 'Karim',
  },
  {
    id: '4',
    titre: 'Table basse en bois massif',
    prix: 950,
    photo: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=500&q=80',
    latitude: 35.7480, // Quartier de la Kasbah
    longitude: -5.8150,
    vendeur: 'Salma',
  },
  {
    id: '5',
    titre: 'PlayStation 5 avec 2 manettes',
    prix: 4300,
    photo: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80',
    latitude: 35.7890, // Près du Port de Tanger Ville
    longitude: -5.8080,
    vendeur: 'Ahmed',
  },
  {
    id: '6',
    titre: 'Guitare acoustique Yamaha',
    prix: 1200,
    photo: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=500&q=80',
    latitude: 35.7650, // Quartier Marshan
    longitude: -5.8320,
    vendeur: 'Nadia',
  },
  {
    id: '7',
    titre: 'Casque Bose QuietComfort 35 II',
    prix: 1600,
    photo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    latitude: 35.7510, // Quartier Val Fleuri
    longitude: -5.8390,
    vendeur: 'Omar',
  },
  {
    id: '8',
    titre: 'Machine à café Nespresso neuve',
    prix: 850,
    photo: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80',
    latitude: 35.7680, // Quartier California
    longitude: -5.8420,
    vendeur: 'Zineb',
  },
];

export function filtrerParRayon(userLocation, rayonKm) {
  if (!userLocation) return [];
  
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