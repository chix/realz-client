import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Colors from './constants/Colors';
import { ExpoTokenProvider } from './contexts/ExpoTokenContext'
import useCachedResources from './hooks/useCachedResources';
import AppNavigator from './navigation/AppNavigator';
import * as RootNavigation from './navigation/RootNavigation';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoToken, setExpoToken] = useState(null);
  const isLoadingComplete = useCachedResources();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoToken(token));
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.id &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      RootNavigation.push('AdDetailScreen', { id: lastNotificationResponse.notification.request.content.data.id });
    }
  }, [lastNotificationResponse]);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.backgroundColor}/>
        <ExpoTokenProvider value={expoToken}>
          <AppNavigator/>
        </ExpoTokenProvider>
      </View>
    </SafeAreaProvider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('new-listing', {
      name: 'New listing',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      enableVibrate: true,
    });
  }

  return token;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});
