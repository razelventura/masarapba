//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//App.js
//brief: This is the main page that the users will see after the splash screen. 
    //They can choose here to view the instructions, add an entry, or view existing entries

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import instructionsText from './components/Instructions';

// Prevent the splash screen from hiding immediately
SplashScreen.preventAutoHideAsync();

export default function App() {

  //Splash screen
  useEffect(() => {
    async function prepare() {
      // Wait 4 seconds
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Hide the splash screen
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  //Instructions
  const showInstructions = () => {
    Alert.alert("About 'Masarap Ba?'", instructionsText, [{ text: "OK" }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>MASARAP BA?</Text>
      <Button title="How to Use" onPress={showInstructions} />
      <Button title="Add an Entry" onPress={() => {}} />
      <Button title="View Entries" onPress={() => {}} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold'
  },
});
