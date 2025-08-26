import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

import useCachedResources from '@/hooks/useCachedResources';
import Colors from '@/constants/Colors';
import { ExpoTokenProvider } from '@/contexts/ExpoTokenContext'
import { useEffect, useState } from "react";
import { AdvertTypeEnum } from "@/types";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [expoToken, setExpoToken] = useState<string|null>(null);
  const isLoadingComplete = useCachedResources();
  const lastNotificationResponse = Notifications.useLastNotificationResponse() as Notifications.NotificationResponse & {
    notification: {
        request: {
            content: {
                dataString?: string
            }
        }
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoToken(token));
  }, []);

  useEffect(() => {
    if (
      isLoadingComplete &&
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content &&
      (lastNotificationResponse.notification.request.content.data || lastNotificationResponse.notification.request.content.dataString)
    ) {
      const data = lastNotificationResponse.notification.request.content.data ?? JSON.parse(lastNotificationResponse.notification.request.content.dataString ?? '{}');
      const id = data?.id as number;
      const type = data?.type as AdvertTypeEnum;
      if (id && type) {
        router.push({ pathname: `/${type}/[id]`, params: { id }})
      }
    }
  }, [lastNotificationResponse, isLoadingComplete]);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.background}/>
        <ExpoTokenProvider value={expoToken}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="rent/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="sale/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ExpoTokenProvider>
      </View>
    </SafeAreaProvider>
  );
}

async function registerForPushNotificationsAsync() {
  let token = null;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('new-listing', {
      name: 'New listing',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      enableVibrate: true,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    try {
      token = (await Notifications.getExpoPushTokenAsync({projectId})).data;
    } catch (e: unknown) { }
  }

  return token;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
