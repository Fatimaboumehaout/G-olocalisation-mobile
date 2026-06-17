# GeoMarket 📍
 
**Vos voisins ont des trésors**
 
GeoMarket est une application mobile de petites annonces géolocalisées, développée avec React Native et Expo. Inspirée d'applications comme Wallapop, Leboncoin ou Vinted, elle permet à l'utilisateur de découvrir les annonces disponibles autour de sa position actuelle, dans un rayon qu'il définit lui-même.
 
## Fonctionnalités
 
- **Détection automatique de la position** via le GPS du téléphone, avec gestion des permissions, un état de chargement et un écran d'erreur avec bouton "Réessayer" en cas de refus.
- **Reverse geocoding** : la ville de l'utilisateur est affichée en clair à partir de ses coordonnées GPS.
- **Configuration du rayon de recherche** entre 1 et 20 km via un slider, avec des raccourcis rapides (🚶 2 km, 🚲 5 km, 🚗 15 km).
- **Compteur dynamique** du nombre d'annonces disponibles dans le rayon choisi, mis à jour en temps réel avant même d'ouvrir la carte.
- **Carte interactive** (Google Maps) affichant :
  - la position de l'utilisateur en temps réel (marqueur animé qui suit les déplacements),
  - le rayon de recherche sous forme de cercle,
  - les annonces sous forme de marqueurs.
- **Aperçu d'annonce** : un tap sur un marqueur affiche une carte de prévisualisation (photo, titre, vendeur, prix, distance).
- **Changement de type de carte** : standard, satellite ou hybride.
- **Recentrage GPS** en un tap.
## Stack technique
 
| Catégorie | Technologie |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Langage | JavaScript (JSX) |
| Navigation | React Navigation 6 (Native Stack) |
| Cartographie | react-native-maps (provider Google) |
| Géolocalisation | expo-location |
| UI | @expo/vector-icons (Feather), @react-native-community/slider |
 
## Structure du projet
 
```
GeoMarket/
├── App.js                       # Point d'entrée, enveloppe la navigation
├── index.js                     # Enregistrement du composant racine (Expo)
├── app.json                     # Configuration Expo (permissions, icônes, plugins)
├── navigation/
│   └── AppNavigator.js          # Stack de navigation (Config → Map)
├── screens/
│   ├── ConfigZoneScreen.jsx     # Écran de configuration (prénom, position, rayon)
│   └── MapScreen.jsx            # Écran carte avec annonces et position en direct
├── components/
│   └── AnnoncePreviewCard.jsx   # Carte de prévisualisation d'une annonce
├── hooks/
│   └── useLocation.js           # Hook custom : permission GPS + reverse geocoding
├── utils/
│   └── haversine.js             # Calcul de distance entre deux coordonnées GPS
├── data/
│   └── annonces.js              # Données d'annonces (mock) + filtrage par rayon
└── assets/                      # Icônes et splash screen
```
 
## Prérequis
 
- Node.js (version LTS recommandée)
- npm
- L'application **Expo Go** sur un téléphone (Android/iOS), ou un émulateur/simulateur configuré
- Une clé API Google Maps valide pour l'affichage de la carte (Android nécessite une configuration spécifique, voir la documentation `react-native-maps`)
## Installation
 
```bash
git clone https://github.com/Fatimaboumehaout/G-olocalisation-mobile.git
cd G-olocalisation-mobile/GeoMarket
npm install
```
 
## Lancement
 
```bash
npm start          # Lance le serveur Expo (scanner le QR code avec Expo Go)
npm run android    # Lance directement sur un émulateur/téléphone Android
npm run ios        # Lance directement sur un simulateur/téléphone iOS
npm run web        # Lance la version web
```
 
## Permissions de géolocalisation
 
L'application demande l'accès à la position au lancement (`ACCESS_FINE_LOCATION` et `ACCESS_COARSE_LOCATION` sur Android, `NSLocationWhenInUseUsageDescription` sur iOS). Si l'utilisateur refuse, un écran dédié propose de relancer la demande ou d'ouvrir directement les réglages du téléphone.
 
## Données
 
Les annonces affichées proviennent actuellement d'un jeu de données statique (`data/annonces.js`), centré sur la ville de Tanger à titre de démonstration. La fonction `filtrerParRayon` calcule la distance de chaque annonce par rapport à l'utilisateur (via `haversine.js`) et ne garde que celles comprises dans le rayon sélectionné. Cette couche est conçue pour être remplacée facilement par un appel à une API backend.
 
## Pistes d'amélioration
 
- Connexion à une API backend pour des annonces dynamiques (publication, recherche, filtres par catégorie)
- Authentification utilisateur et gestion de profil vendeur
- Système de messagerie entre acheteur et vendeur
- Pagination / clustering des marqueurs pour de grands volumes d'annonces
## Licence
 
Ce projet est distribué sous licence MIT.