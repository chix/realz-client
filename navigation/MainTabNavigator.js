import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import AdDetailScreen from '../screens/AdDetailScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const BottomTab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="Home">
      <BottomTab.Screen
        name="Home"
        component={HomeTabNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={Platform.OS === 'ios' ? `ios-home${focused ? '' : '-outline'}` : 'md-home'}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsTabNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const HomeTabStack = createStackNavigator();

function HomeTabNavigator() {
  return (
    <HomeTabStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeTabStack.Screen
        name="HomeScreen"
        component={HomeScreen}
      />
      <HomeTabStack.Screen
        name="AdDetailScreen"
        component={AdDetailScreen}
      />
    </HomeTabStack.Navigator>
  );
}

const SettingsTabStack = createStackNavigator();

function SettingsTabNavigator() {
  return (
    <SettingsTabStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsTabStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
      />
    </SettingsTabStack.Navigator>
  );
}
