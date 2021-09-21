import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Sale: {
            path: 'sale',
            screens: {
              SaleList: 'list',
              SaleDetail: 'detail/:id',
            },
            initialRouteName: 'SaleList',
          },
          Rent: {
            path: 'rent',
            screens: {
              RentList: 'list',
              RentDetail: 'detail/:id',
            },
            initialRouteName: 'RentList',
          },
          Notifications: 'notifications',
        },
      },
      NotFound: '*',
    },
  },
  async getInitialURL() {
    // Check if app was opened from a deep link
    let url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();
    const id = response?.notification.request.content.data.id as string|undefined;
    const type = response?.notification.request.content.data.type as string|undefined;
    if (id && type) {
      return Linking.createURL(type + '/detail/' + id);
    }

    return undefined
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const id = response?.notification.request.content.data.id as string|undefined;
      const type = response?.notification.request.content.data.type as string|undefined;
      if (!id || !type) {
        return;
      }

      listener(Linking.createURL(type + '/detail/' + id));
    });

    return () => {
      Linking.removeEventListener('url', onReceiveURL);
      subscription.remove();
    };
  },
};

export default linking;
