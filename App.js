import Colors from './constants/Colors';
import AppNavigator from './navigation/AppNavigator';
import NavigationService from './navigation/NavigationService';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import Constants from 'expo-constants';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.addNotificationResponseReceivedListener((response) => {
  if (response.notification) {
    if (response.notification.request.content.data) {
      NavigationService.push('AdDetail', {id: response.notification.request.content.data.id});
    } else {
      NavigationService.navigate('Home');
    }
  }
});

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    expoToken: null,
  };

  componentDidMount() {
    this.registerForPushNotifications().then(token => this.setState({expoToken: token}));
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar style="dark" backgroundColor={Colors.backgroundColor}/>
          <AppNavigator screenProps={{expoToken: this.state.expoToken}} ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}/>
        </View>
      );
    }
  }

  registerForPushNotifications = async () => {
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
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
      Asset.fromModule(require('./assets/images/placeholder.jpg')).downloadAsync(),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});
