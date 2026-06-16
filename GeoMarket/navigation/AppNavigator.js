import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConfigZoneScreen from '../screens/ConfigZoneScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Config"
        component={ConfigZoneScreen}
        options={{ title: 'Ma zone' }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Annonces près de moi' }}
      />
    </Stack.Navigator>
  );
}