import API from '../constants/Api';
import Colors from '../constants/Colors';
import React from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Tile, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Notifications, WebBrowser } from 'expo';
import { AdItem } from '../components/AdItem';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true, dataSource: [] };
  }

  componentDidMount() {
    Notifications.addListener(this.handleNotification);
    return this.fetchData();
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

    return fetch(API.host+'/api/adverts')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        });

      })
      .catch(() => {
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity('Could not fetch data, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
        }
      });
  }

  handleNotification = (notification) => {
    const { navigate } = this.props.navigation;

    if (notification.origin === 'selected') {
      this.fetchData();
      if (notification.data.id) {
        navigate('AdDetail', {id: notification.data.id});
      } else {
        navigate('Home');
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
