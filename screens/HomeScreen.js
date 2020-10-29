import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import {
  AsyncStorage,
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
  View
} from 'react-native';
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
          <ActivityIndicator size="large" color={Colors.tintColor}/>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataSource}
          renderItem={(item) => <AdItem navigation={this.props.navigation} {...item}/>}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.fetchData}
              tintColor={Colors.backgroundColor}
              titleColor={Colors.backgroundColor}
              colors={[Colors.tintColor, Colors.tintColor, Colors.tintColor]}
            />
          }
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

    return fetch(API.host+'/api/adverts?exists[deletedAt]=false&order[id]=desc&type.code=' + this.state.advertType, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
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
    backgroundColor: Colors.background,
  },
});
