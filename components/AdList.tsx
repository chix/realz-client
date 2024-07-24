import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import AdListItem from '@/components/AdListItem';
import API from '@/constants/Api';
import Cities from '@/constants/Cities';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Advert } from '@/types';

export default function AdList({ advertType, showFilter }: { advertType: string, showFilter?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [city, setCity] = useState(Cities.brno.code);

  const fetchData = async () => {
    setIsLoading(page === 1);

    let url = API.host+'/api/adverts?exists[deletedAt]=false&order[id]=desc&type.code=' + advertType + '&page=' + page + '&property.location.city.code=' + city;

    return fetch(url, {
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

  // handle page change
  useEffect(() => {
    if (page === 0) {
      setIsLoading(true);
      setPage(1);
    } else {
      fetchData();
    }
  }, [page]);

  useEffect(() => {
    setPage(0);
  }, [city]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.tintColor}/>
      </View>
    );
  }

  const renderCityOptions = () => {
    return Object.keys(Cities).map((city) => {
      return (
        <Picker.Item key={city} label={Cities[city].label} value={Cities[city].code} />
      );
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FlatList
          data={dataSource}
          renderItem={(item) => <AdListItem advertType={advertType} {...item}/>}
          keyExtractor={(item: Advert) => item.id.toString()}
          onEndReached={addPage}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refresh}
              tintColor={Colors.background}
              titleColor={Colors.background}
              colors={[Colors.tintColor, Colors.tintColor, Colors.tintColor]}
            />
          }
        >
        </FlatList>
      </View>
      {
        showFilter ?
          <View style={styles.cityPickerContainer}>
            <Text style={styles.textLabel}>City:</Text>
            <Picker
              selectedValue={city}
              onValueChange={setCity}
              style={styles.picker}
              mode="dropdown"
            >
              { renderCityOptions() }
            </Picker>
          </View>
        : <></>
      }
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
  cityPickerContainer: {
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    borderTopWidth: 1,
    borderTopColor: Colors.text,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
  },
  picker: {
    fontSize: Layout.labelFontSize,
    width: 200,
    color: Colors.text,
  },
  textLabel: {
    fontSize: Layout.labelFontSize,
    color: Colors.text,
  },
});
