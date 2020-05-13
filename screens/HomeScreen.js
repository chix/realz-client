import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import {
  AsyncStorage,
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  ToastAndroid,
  View
} from 'react-native';
import { Notifications } from 'expo';
import { AdItem } from '../components/AdItem';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true, advertType: 'sale', dataSource: [] };
  }

  componentDidMount() {
    const { navigation } = this.props;

    Notifications.addListener(this.handleNotification);

    this.focusListener = navigation.addListener("didFocus", () => {
      AsyncStorage.getItem('@Setttings:main')
      .then((settings) => {
        if (settings !== null) {
          const parsedSettings = JSON.parse(settings);
          if (parsedSettings.advertType && this.state.advertType !== parsedSettings.advertType) {
            this.setState({advertType: parsedSettings.advertType}, this.fetchData);
          }
        }
      });
    });

    AsyncStorage.getItem('@Setttings:main')
    .then((settings) => {
      if (settings !== null) {
        const parsedSettings = JSON.parse(settings);
        if (parsedSettings.advertType) {
          return this.setState({advertType: parsedSettings.advertType}, this.fetchData);
        }
      }
      return this.fetchData();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large"/>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataSource}
          renderItem={(item) => <AdItem navigation={this.props.navigation} {...item}/>}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={this.fetchData}
          refreshing={this.state.isLoading}
        >
        </FlatList>
      </View>
    );
  }

  onRefresh = async () => {
    return this.fetchData();
  }

  fetchData = async () => {
    this.setState({isLoading: true});

    return fetch(API.host+'/api/adverts/' + this.state.advertType)
      .then((response) => {
        if (response.ok === false) {
          throw new Error(response.statusText);
        }
        return response.json()
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          dataSource: [],
        }, () => {
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity('Could not fetch data, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
          }
        });
      });
  }

  handleNotification = (notification) => {
    const { push } = this.props.navigation;

    if (notification.origin === 'selected') {
      this.fetchData();
      if (notification.data.id) {
        push('AdDetail', {id: notification.data.id});
      } else {
        navigate('Home');
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Layout.mainStatusBarHeight,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
