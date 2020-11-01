import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import MainTabNavigator from './MainTabNavigator';
import { navigationRef } from './RootNavigation';

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
