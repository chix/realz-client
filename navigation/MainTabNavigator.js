import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import AdDetailScreen from '../screens/AdDetailScreen';
import RentScreen from '../screens/RentScreen';
import SaleScreen from '../screens/SaleScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const BottomTab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="Sale">
      <BottomTab.Screen
        name="Sale"
        component={SaleTabNavigator}
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
        name="Rent"
        component={RentTabNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={Platform.OS === 'ios' ? `ios-calendar${focused ? '' : '-outline'}` : 'md-calendar'}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationsTabNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              name={Platform.OS === 'ios' ? `ios-notifications${focused ? '' : '-outline'}` : 'md-notifications'}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const SaleTabStack = createStackNavigator();

function SaleTabNavigator() {
  return (
    <SaleTabStack.Navigator screenOptions={{ headerShown: false }}>
      <SaleTabStack.Screen
        name="SaleScreen"
        component={SaleScreen}
      />
      <SaleTabStack.Screen
        name="AdDetailScreen"
        component={AdDetailScreen}
      />
    </SaleTabStack.Navigator>
  );
}

const RentTabStack = createStackNavigator();

function RentTabNavigator() {
  return (
    <RentTabStack.Navigator screenOptions={{ headerShown: false }}>
      <RentTabStack.Screen
        name="RentScreen"
        component={RentScreen}
      />
      <RentTabStack.Screen
        name="AdDetailScreen"
        component={AdDetailScreen}
      />
    </RentTabStack.Navigator>
  );
}

const NotificationsTabStack = createStackNavigator();

function NotificationsTabNavigator() {
  return (
    <NotificationsTabStack.Navigator screenOptions={{ headerShown: false }}>
      <NotificationsTabStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
    </NotificationsTabStack.Navigator>
  );
}
