import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export default function AdItem({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home', { params: { id: item.id }, screen: 'AdDetailScreen' })}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{(item.title.length > 28) ? item.title.substring(0, 28) + '...' : item.title}</Text>
          <Text style={styles.headerText}>
            {(item.price !== undefined && item.price !== null) ? item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč' : ''}
          </Text>
        </View>
        <View style={styles.imageContainer}>
          {
            (item.source)
            &&
            <Text style={styles.sourceBadge}>{item.source.name}</Text>
          }
          <ImageBackground source={require('../assets/images/placeholder.jpg')} style={styles.placeholder}>
            {
              (item.property.images[0] !== undefined)
              &&
              <Image
                source={{uri: item.property.images[0].thumbnail}}
                style={styles.image}
              />
            }
          </ImageBackground>      
          <ImageBackground source={require('../assets/images/placeholder.jpg')} style={styles.placeholder}>
            {
              (item.property.images[1] !== undefined)
              &&
              <Image
                source={{uri: item.property.images[1].thumbnail}}
                style={styles.image}
              />
            }
          </ImageBackground>      
        </View>
        <View>
          <Text style={styles.subheaderText}>{item.property.location.street}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: Math.round(Layout.sideMargin / 2),
    marginBottom: Math.round(Layout.sideMargin / 2),
  },
  headerContainer: {
    flex: 1,
    width: Layout.width - (2 * Layout.sideMargin),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sourceBadge: {
    position: 'absolute',
    right: 3,
    top: 15,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    zIndex: 1,
    color: Colors.badgeText,
    backgroundColor: Colors.badgeBackground,
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
  headerText: {
    fontSize: Layout.subheaderFontSize,
    color: Colors.text,
    textAlign: 'center',
  },
  subheaderText: {
    fontSize: Layout.normalFontSize,
    color: Colors.text,
    textAlign: 'center',
  },
});
