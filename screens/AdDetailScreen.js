import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
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
import ImageGallery from 'react-native-image-viewing';

import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const AdDetailScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [galleryVisible, setGalleryVisible] = React.useState(false);
  const [galleryIndex, setGalleryIndex] = React.useState(0);

  const onClick = () => {
    WebBrowser.openBrowserAsync(data.externalUrl);
  };

  const renderImageThumbnails = () => {
    return data.property.images.map((image, index) => {
      return (
        <ImageBackground source={require('../assets/images/placeholder.jpg')} style={styles.placeholder} key={image.image}>
          <TouchableOpacity onPress={() => onGalleryOpen(index)}>
            <Image
              source={{uri: image.thumbnail}}
              style={styles.image}
              onPress={onGalleryOpen}
            />
          </TouchableOpacity>
        </ImageBackground>      
      );
    });
  };

  const onGalleryOpen = (index) => {
    setGalleryIndex(index);
    setGalleryVisible(true);
  };

  const getGalleryImageUrls = () => {
    return data.property.images.map((image) => {
      return { uri: image.image };
    });
  };

  const onGalleryClose = () => {
    setGalleryVisible(false);
  };

  const fetchData = async (href) => {
    setIsLoading(true);

    return fetch(href, {
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
      setData(responseJson);
    })
    .catch(() =>{
      setIsLoading(false);
      setData(null);
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity('Could not fetch data, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    });
  };

  useEffect(() => {
    const id = navigation.getParam('id');

    fetchData(API.host+'/api/adverts/'+id);
  }, []);

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
        <Text style={styles.headerText}>{data.title}</Text>
        <Text style={styles.subheaderText}>{data.property.location.street}</Text>
        <Text style={styles.subheaderText}>
          {(data.price !== undefined && data.price !== null) ? data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč' : ''}
        </Text>
        <View style={styles.imageContainer}>
          { renderImageThumbnails() }
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{data.description}</Text>
          <View style={styles.spacer}/>
          <Button color={Colors.button} title={'View on '+data.source.name} onPress={onClick}/>
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

AdDetailScreen.navigationOptions = () => ({
  headerShown: false
});

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
    resizeMode: 'stretch',
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
    fontSize: Layout.headerFontSize,
    color: Colors.text,
    textAlign: 'center',
  },
  subheaderText: {
    fontSize: Layout.subheaderFontSize,
    color: Colors.text,
    textAlign: 'center',
  },
  text: {
    color: Colors.text,
    fontSize: Layout.normalFontSize,
  },
  spacer: {
    marginTop: Layout.sideMargin,
  },
});

export default AdDetailScreen;
