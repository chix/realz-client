import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
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
            <Text style={styles.headerText}>{(item.title.length > 28) ? item.title.substring(0, 28) + '...' : item.title}</Text>
            <Text style={styles.headerText}>
              {(item.price !== undefined && item.price !== null) ? item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč' : ''}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            {
              (item.property.images[0] !== undefined)
              &&
              <Image
                source={{uri: item.property.images[0].thumbnail}}
                style={styles.image}
              />
            }
            {
              (item.property.images[1] !== undefined)
              &&
              <Image
                source={{uri: item.property.images[1].thumbnail}}
                style={styles.image}
              />
            }
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
  image: {
    width: Math.round(Layout.width / 2) - Layout.sideMargin - 3,
    height: Math.round((Math.round(Layout.width / 2) - Layout.sideMargin - 3) / 4 * 3),
    resizeMode: 'contain',
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
