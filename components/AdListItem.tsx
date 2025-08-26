import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Advert, AdvertTypeEnum } from '@/types';
import { currencyFormatter } from '@/services/utils';

export default function AdListItem({ advertType, item }: { advertType: AdvertTypeEnum, item: Advert }) {
  return (
    <TouchableOpacity onPress={() => router.push({ pathname: `/${advertType}/[id]`, params: { id: item.id}})}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{(item.title.length > 28) ? item.title.substring(0, 28) + '...' : item.title}</Text>
          <Text style={styles.headerText}>
            {(item.price !== undefined && item.price !== null) ? currencyFormatter.format(item.price) : ''}
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <View style={styles.badgeContainer}>
            {
              (item.source)
              &&
              <Text style={styles.badge}>{item.source.name}</Text>
            }
            {
              (item.previousPrice !== undefined && item.previousPrice !== null && item.previousPrice !== item.price)
              &&
              <Text style={[styles.badge, styles.badgePreviousPrice]}>{currencyFormatter.format(item.previousPrice)}</Text>
            }
            {
              (item.property.floor !== undefined && item.property.floor !== null)
              &&
              <Text style={styles.badge}>{item.property.floor}{item.property.floor === 1 ? 'st' : item.property.floor === 2 ? 'nd' : 'th'} floor</Text>
            }
            {
              (item.property.construction)
              &&
              <Text style={styles.badge}>{item.property.construction.code}</Text>
            }
          </View>
          <ImageBackground source={require('../assets/images/placeholder.jpg')} style={styles.placeholder}>
            {
              (item.property.images[0] !== undefined)
              &&
              <Image
                source={{uri: item.property.images[0].thumbnail}}
                style={styles.image}
                contentFit='fill'
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
                contentFit='fill'
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
  badgeContainer: {
    position: 'absolute',
    right: 3,
    top: 15,
    zIndex: 1,
  },
  badge: {
    marginBottom: 3,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    zIndex: 1,
    color: Colors.badgeText,
    backgroundColor: Colors.badgeBackground,
    alignSelf: 'flex-end',
  },
  badgePreviousPrice: {
    textDecorationLine: 'line-through',
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
