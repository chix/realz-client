import API from '../constants/Api';
import Colors from '../constants/Colors';
import React from 'react';
import { ActivityIndicator, Button, Linking, Image, Platform, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
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
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.headerText}>{data.title}</Text>
        <Text style={styles.subheaderText}>{data.property.location.street}</Text>
        <Text style={styles.subheaderText}>
          {data.price !== null ? data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč' : ''}
        </Text>
        <View style={styles.imageContainer}>
          { this.renderImages() }
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{data.description}</Text>
          <Button color={Colors.button} title={'Otevřít na '+data.source.name} onPress={this.onClick}/>
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
        <Image
          source={{uri: image.thumbnail}}
          style={styles.image}
          key={image.image}
        />
      );
    });
  }

  fetchData = async (href) => {
    this.setState({isLoading: true});

    return fetch(href)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          data: responseJson,
        });

      })
      .catch(() =>{
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity('Could not fetch data, no connection.', ToastAndroid.LONG, ToastAndroid.BOTTOM);
        }
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    paddingTop: 10,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 135,
    resizeMode: 'contain',
    margin: 3,
  },
  textContainer: {
    marginLeft: 22,
    marginRight: 22,
    marginTop: 10,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    color: Colors.text,
    lineHeight: 30,
    textAlign: 'center',
  },
  subheaderText: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 20,
    textAlign: 'center',
  },
  text: {
    color: Colors.text,
  },
  spacer: {
    height: 20,
  },
  mt10: {
    marginTop: 10,
  },
});
