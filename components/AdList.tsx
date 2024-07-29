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
import Locations from '@/constants/Locations';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Advert } from '@/types';

export default function AdList({ advertType, showFilter }: { advertType: string, showFilter?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState(Locations.brno);
  const [type, setType] = useState('');
  const [subtype, setSubtype] = useState('');

  const fetchData = async () => {
    setIsLoading(page === 1);

    let url = `${API.host}/api/adverts?exists[deletedAt]=false&order[id]=desc&type.code=${advertType}&page=${page}&property.location.${location.type}.code=${location.code}`
      + (type ? `&property.type.code=${type}` : '')
      + (subtype ? `&property.subtype.code=${subtype}` : '');

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
  }, [location]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.tintColor}/>
      </View>
    );
  }

  const renderLocationOptions = () => {
    return Object.keys(Locations).map((key) => {
      return (
        <Picker.Item key={key} label={Locations[key].label} value={Locations[key]} />
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
          <View>
            <View style={styles.locationPickerContainer}>
              <Text style={styles.textLabel}>Location:</Text>
              <Picker
                selectedValue={location}
                onValueChange={setLocation}
                style={styles.picker}
                mode="dropdown"
              >
                { renderLocationOptions() }
              </Picker>
            </View>
            <View style={styles.typePickerContainer}>
              <Text style={styles.textLabel}>Type:</Text>
              <Picker
                selectedValue={type}
                onValueChange={setType}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="All" value="" />
                <Picker.Item label="Flat" value="flat" />
                <Picker.Item label="House" value="house" />
                <Picker.Item label="Land" value="land" />
              </Picker>
            </View>
            <View style={styles.typePickerContainer}>
              <Text style={styles.textLabel}>Subtype:</Text>
              <Picker
                selectedValue={subtype}
                onValueChange={setSubtype}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="All" value="" />
                <Picker.Item label="House" value="house" />
                <Picker.Item label="Cottage" value="cottage" />
                <Picker.Item label="Garrage" value="garrage" />
                <Picker.Item label="Farm" value="farm" />
                <Picker.Item label="Property" value="property" />
                <Picker.Item label="Field" value="field" />
                <Picker.Item label="Woods" value="woods" />
                <Picker.Item label="Plantation" value="plantation" />
                <Picker.Item label="Garden" value="garden" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
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
  locationPickerContainer: {
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    borderTopWidth: 1,
    borderTopColor: Colors.text,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  typePickerContainer: {
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
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
