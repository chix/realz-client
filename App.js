import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
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

Notifications.addNotificationResponseReceivedListener(response => {
  if (response.notification) {
    if (response.notification.request.content.data) {
      RootNavigation.push('AdDetailScreen', { id: response.notification.request.content.data.id });
    } else {
      RootNavigation.navigate('Home');
    }
  }
});

export default function App() {
  const [expoToken, setExpoToken] = React.useState(null);
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    registerForPushNotifications().then(token => setExpoToken(token));
  }, []);

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

async function registerForPushNotifications() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
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
