import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
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

export default class AdDetailScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true, data: null, galleryVisible: false, galleryIndex: 0 };
  }

  componentDidMount() {
    const id = this.props.navigation.getParam('id');

    return this.fetchData(API.host+'/api/adverts/'+id);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.tintColor}/>
        </View>
      )
    }

    const { data, galleryIndex, galleryVisible } = this.state;

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
            { this.renderImageThumbnails() }
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{data.description}</Text>
            <View style={styles.spacer}/>
            <Button color={Colors.button} title={'View on '+data.source.name} onPress={this.onClick}/>
            <View style={styles.spacer}/>
            <View style={styles.spacer}/>
          </View>
        </ScrollView>
        <ImageGallery
          images={this.getGalleryImageUrls()}
          imageIndex={galleryIndex}
          visible={galleryVisible}
          onRequestClose={this.onGalleryClose}
          presentationStyle='overFullScreen'
        />
      </SafeAreaView>
    );
  }

  onClick = () => {
    const { data } = this.state;

    WebBrowser.openBrowserAsync(data.externalUrl);
  }

  renderImageThumbnails = () => {
    const { data } = this.state;

    return data.property.images.map((image, index) => {
      return (
        <ImageBackground source={require('../assets/images/placeholder.jpg')} style={styles.placeholder} key={image.image}>
          <TouchableOpacity onPress={() => this.onGalleryOpen(index)}>
            <Image
              source={{uri: image.thumbnail}}
              style={styles.image}
              onPress={this.onGalleryOpen}
            />
          </TouchableOpacity>
        </ImageBackground>      
      );
    });
  }

  onGalleryOpen = (index) => {
    this.setState({galleryIndex: index, galleryVisible: true});
  }

  getGalleryImageUrls = () => {
    const { data } = this.state;

    return data.property.images.map((image) => {
      return { uri: image.image };
    });
  }

  onGalleryClose = () => {
    this.setState({galleryVisible: false});
  }

  fetchData = async (href) => {
    this.setState({isLoading: true});

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
      this.setState({
        isLoading: false,
        data: responseJson,
      });
    })
    .catch(() =>{
      this.setState({
        isLoading: false,
        data: null,
      }, () => {
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity('Could not fetch data, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
        }
      });
    });
  }
}

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
