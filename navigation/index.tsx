import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Platform } from 'react-native';

import TabBarIcon from '../components/TabBarIcon';
import NotFoundScreen from '../screens/NotFoundScreen';
import RentScreen from '../screens/RentScreen';
import RentDetailScreen from '../screens/RentDetailScreen';
import SaleScreen from '../screens/SaleScreen';
import SaleDetailScreen from '../screens/SaleDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { RentStackParamList, RootStackParamList, RootTabParamList, SaleStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation() {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const RootStack = createNativeStackNavigator<RootStackParamList>();
function RootNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }}/>
      <RootStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </RootStack.Navigator>
  );
}

const SaleTabStack = createNativeStackNavigator<SaleStackParamList>();
function SaleTabNavigator() {
  return (
    <SaleTabStack.Navigator initialRouteName="SaleList" screenOptions={{ headerShown: false }}>
      <SaleTabStack.Screen name="SaleList" component={SaleScreen} />
      <SaleTabStack.Screen name="SaleDetail" component={SaleDetailScreen} />
    </SaleTabStack.Navigator>
  );
}

const RentTabStack = createNativeStackNavigator<RentStackParamList>();
function RentTabNavigator() {
  return (
    <RentTabStack.Navigator initialRouteName="RentList"  screenOptions={{ headerShown: false }}>
      <RentTabStack.Screen name="RentList" component={RentScreen} />
      <RentTabStack.Screen name="RentDetail" component={RentDetailScreen} />
    </RentTabStack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="Sale" screenOptions={{ headerShown: false }}>
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
        component={NotificationsScreen}
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
