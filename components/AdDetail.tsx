import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import { Image } from 'expo-image';
import ImageGallery from 'react-native-image-viewing';

import API from '@/constants/Api';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Advert, PropertyImage } from '@/types';

export default function AdDetail({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Advert>();
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const onClick = () => {
    if (data) {
      WebBrowser.openBrowserAsync(data.externalUrl);
    }
  };

  const renderImageThumbnails = () => {
    return data?.property.images.map((image: PropertyImage, index: number) => {
      return (
        <ImageBackground source={require('../assets/images/placeholder.jpg')} style={styles.placeholder} key={image.image}>
          <TouchableOpacity onPress={() => onGalleryOpen(index)}>
            <Image
              source={{uri: image.thumbnail}}
              style={styles.image}
              contentFit='fill'
            />
          </TouchableOpacity>
        </ImageBackground>      
      );
    });
  };

  const onGalleryOpen = (index: number) => {
    setGalleryIndex(index);
    setGalleryVisible(true);
  };

  const getGalleryImageUrls = () => {
    if (!data) {
      return [];
    }
    return data.property.images.map((image: PropertyImage) => {
      return { uri: image.image };
    });
  };

  const onGalleryClose = () => {
    setGalleryVisible(false);
  };

  const fetchData = async (href: string) => {
    setIsLoading(true);

    return fetch(href, {
      method: 'GET',
      headers: {
        Accept: 'application/ld+json',
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
      setData(responseJson);
    })
    .catch(() =>{
      setIsLoading(false);
      setData(undefined);
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity('Could not fetch data, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    });
  };

  useEffect(() => {
    fetchData(API.host+'/api/adverts/'+id);
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.tintColor}/>
      </View>
    )
  }

  if (data === null) {
    return (
      <View></View>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container}>
        <Text style={styles.headerText}>{data?.title}</Text>
        <Text style={styles.subheaderText}>{data?.property.location.street}</Text>
        <Text style={styles.subheaderText}>
          {(data?.price !== undefined && data.price !== null) ? data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč ' : ' '}
          {(data?.previousPrice !== undefined && data.previousPrice !== null && data.previousPrice !== data.price) &&
            <Text style={styles.previousPriceText}>{data.previousPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč'}</Text>
          }
        </Text>
        <View style={styles.imageContainer}>
          { renderImageThumbnails() }
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{data?.description}</Text>
          <View style={styles.spacer}/>
          <Button color={Colors.button} title={'View on '+data?.source.name} onPress={onClick}/>
          <View style={styles.spacer}/>
          <View style={styles.spacer}/>
        </View>
      </ScrollView>
      <ImageGallery
        images={getGalleryImageUrls()}
        imageIndex={galleryIndex}
        visible={galleryVisible}
        onRequestClose={onGalleryClose}
        presentationStyle='overFullScreen'
      />
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
    paddingTop: Math.round(Layout.sideMargin / 2),
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  imageContainer: {
    flex: 1,
    marginTop: Math.round(Layout.sideMargin / 2),
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: Math.round(Layout.width / 2) - Layout.sideMargin - 3,
    height: Math.round((Math.round(Layout.width / 2) - Layout.sideMargin - 3) / 4 * 3),
  },
  placeholder: {
    width: Math.round(Layout.width / 2) - Layout.sideMargin - 3,
    height: Math.round((Math.round(Layout.width / 2) - Layout.sideMargin - 3) / 4 * 3),
    margin: 3,
  },
  textContainer: {
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Math.round(Layout.sideMargin / 2),
  },
  headerText: {
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    fontSize: Layout.headerFontSize,
    color: Colors.text,
    textAlign: 'center',
  },
  subheaderText: {
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    fontSize: Layout.subheaderFontSize,
    color: Colors.text,
    textAlign: 'center',
  },
  previousPriceText: {
    fontSize: Layout.subheaderFontSize,
    color: Colors.text,
    textAlign: 'center',
    textDecorationLine: 'line-through',
  },
  text: {
    color: Colors.text,
    fontSize: Layout.normalFontSize,
  },
  spacer: {
    marginTop: Layout.sideMargin,
  },
});
