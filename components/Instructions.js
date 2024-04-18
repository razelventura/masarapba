//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Instructions.js
//brief: This contains the information about the app.

// Instructions.js
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const instructionsText = `

"Masarap ba?" is Filipino for "Is it delicious?"

Have you ever been to a restaurant for a second or nth time and can't remember what you've liked from your previous visit/s? 

This app is for you! You can log the food that you ordered and decide if it's masarap (delicious) or not. 

Then next time you visit that restaurant, you'd know what to order again and what to avoid!

May your food always be MASARAP! Enjoy!

`;

const creator = `About the Creator`

function InstructionsScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Masarap Ba!</Text>
      <Text style={styles.content}>{instructionsText}</Text>
      
      <TouchableOpacity
        onPress = {() => Linking.openURL('https://www.razelventura.com')}>
        <Text style={styles.hyperlink}>{creator}</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#d8a88b',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d55314'
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  hyperlink: {
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
    color: '#d55314'
  }
});

export default InstructionsScreen;

