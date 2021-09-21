import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { RootStackScreenProps } from '../types';

export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container}>
        <Text style={styles.text}>Apologies, you found a screen that doesn't exist.</Text>
        <Button color={Colors.button} title={'Go to home screen'} onPress={() => navigation.replace('Root')}/>
      </ScrollView>
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
    marginLeft: Layout.sideMargin,
    marginRight: Layout.sideMargin,
    marginTop: Layout.mainStatusBarHeight,
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: Layout.labelFontSize,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.sideMargin,
  },
});
