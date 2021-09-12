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

import AdItem from '../components/AdItem';
import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export default function AdList({ advertType }) {
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setIsLoading(page === 1 ? true : false);

    return fetch(API.host+'/api/adverts?exists[deletedAt]=false&order[id]=desc&type.code=' + advertType + '&page=' + page, {
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
      setDataSource(page === 1 ? responseJson : dataSource.concat(responseJson));
    })
    .catch(() => {
      setIsLoading(false);
      setDataSource([]);
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity('Could not fetch data, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    });
  };

  const addPage = () => {
    setPage(page + 1);
  }

  const refresh = () => {
    setPage(0);
  }

  useEffect(() => {
    if (page === 0) {
      setIsLoading(true);
      setPage(1);
    } else {
      fetchData();
    }
  }, [page]);

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
          renderItem={(item) => <AdItem advertType={advertType} {...item}/>}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={addPage}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refresh}
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
