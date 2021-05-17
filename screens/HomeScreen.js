import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import AdItem from '../components/AdItem';
import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [advertType, setAdvertType] = useState('sale');
  const [dataSource, setDataSource] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);

    return fetch(API.host+'/api/adverts?exists[deletedAt]=false&order[id]=desc&type.code=' + advertType, {
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
      setIsLoading(false);
      setDataSource(responseJson);
    })
    .catch(() => {
      setIsLoading(false);
      setDataSource([]);
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity('Could not fetch data, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    });
  };

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      AsyncStorage.getItem('@Setttings:main')
      .then((settings) => {
        if (settings !== null) {
          const parsedSettings = JSON.parse(settings);
          if (parsedSettings.advertType && advertType !== parsedSettings.advertType) {
            setAdvertType(parsedSettings.advertType);
          }
        }
      });
    });

    AsyncStorage.getItem('@Setttings:main')
    .then((settings) => {
      if (settings !== null) {
        const parsedSettings = JSON.parse(settings);
        if (parsedSettings.advertType) {
          setAdvertType(parsedSettings.advertType);
        }
      }
    });

    return focusListener;
  }, [navigation]);

  // reload if advert type changes
  useEffect(() => {
    fetchData();
  }, [advertType]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.tintColor}/>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FlatList
          data={dataSource}
          renderItem={(item) => <AdItem {...item}/>}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchData}
              tintColor={Colors.backgroundColor}
              titleColor={Colors.backgroundColor}
              colors={[Colors.tintColor, Colors.tintColor, Colors.tintColor]}
            />
          }
        >
        </FlatList>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
