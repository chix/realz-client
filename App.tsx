import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Colors from './constants/Colors';
import { ExpoTokenProvider } from './contexts/ExpoTokenContext'
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoToken, setExpoToken] = useState<string|null>(null);
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoToken(token));
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.background}/>
        <ExpoTokenProvider value={expoToken}>
          <Navigation/>
        </ExpoTokenProvider>
      </View>
    </SafeAreaProvider>
  );
};

async function registerForPushNotificationsAsync() {
  let token = null;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
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
    backgroundColor: Colors.background,
  },
});
