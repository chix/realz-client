import Colors from '../constants/Colors';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export class AdItem extends React.Component {
  render() {
    const { navigate, push } = this.props.navigation;
    const { item } = this.props;

    return (
      <TouchableOpacity onPress={() => navigate('AdDetail', {id: item.id})}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{item.title}</Text>
            <Text style={styles.headerText}>
              {(item.price !== null) ? item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč' : ''}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: item.property.images[0].thumbnail}}
              style={styles.image}
            />
            <Image
              source={{uri: item.property.images[1].thumbnail}}
              style={styles.image}
            />
          </View>
          <View>
            <Text style={styles.subheaderText}>{item.property.location.street}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerContainer: {
    flex: 1,
    width: 365,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 135,
    resizeMode: 'contain',
    margin: 3,
  },
  headerText: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 20,
    textAlign: 'center',
  },
  subheaderText: {
    fontSize: 12,
    color: Colors.text,
    lineHeight: 16,
    textAlign: 'center',
  },
});
