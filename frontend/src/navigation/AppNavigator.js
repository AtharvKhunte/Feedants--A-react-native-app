import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CompetitionDetailsScreen from '../screens/CompetitionDetailsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CompetitionDetails" component={CompetitionDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}