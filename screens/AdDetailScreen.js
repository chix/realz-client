import API from '../constants/Api';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import React from 'react';
import { ActivityIndicator, Button, Linking, Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { Notifications, WebBrowser } from 'expo';

export default class AdDetailScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true, data: null };
  }

  componentDidMount() {
    const id = this.props.navigation.getParam('id');

    return this.fetchData(API.host+'/api/adverts/'+id);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large"/>
        </View>
      )
    }

    const { data } = this.state;

    if (data === null) {
      return (
        <View></View>
      )
    }

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.headerText}>{data.title}</Text>
        <Text style={styles.subheaderText}>{data.property.location.street}</Text>
        <Text style={styles.subheaderText}>
          {(data.price !== undefined && data.price !== null) ? data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč' : ''}
        </Text>
        <View style={styles.imageContainer}>
          { this.renderImages() }
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{data.description}</Text>
          <View style={styles.spacer}/>
          <Button color={Colors.button} title={'Otevřít na '+data.source.name} onPress={this.onClick}/>
          <View style={styles.spacer}/>
          <View style={styles.spacer}/>
        </View>
      </ScrollView>
    );
  }

  onClick = () => {
    const { data } = this.state;

    Linking.openURL(data.external_url);
  }

  renderImages = () => {
    const { data } = this.state;

    return data.property.images.map((image) => {
      return (
        <ImageBackground source={require('../assets/images/placeholder.jpg')} style={styles.placeholder} key={image.image}>
          <Image
            source={{uri: image.thumbnail}}
            style={styles.image}
          />
        </ImageBackground>      
      );
    });
  }

  fetchData = async (href) => {
    this.setState({isLoading: true});

    return fetch(href)
      .then((response) => {
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
  container: {
    flex: 1,
    marginTop: Layout.mainStatusBarHeight,
    paddingTop: Math.round(Layout.sideMargin / 2),
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
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
