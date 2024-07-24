import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, Stack } from 'expo-router';

import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView style={styles.root}>
        <ScrollView style={styles.container}>
          <Text style={styles.text}>Apologies, you found a screen that doesn't exist.</Text>
          <View style={styles.buttonContainer}>
            <Link href="/">
              <Button color={Colors.button} title={'Go to home screen'}/>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
  buttonContainer: {
    alignContent: 'center',
    alignItems: 'center',
  }
});
