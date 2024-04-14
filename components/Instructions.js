//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Instructions.js
//brief: This contains the instructions for the user.

// Instructions.js
import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';

const instructionsText = `
Welcome to Masarap Ba! 

"Masarap ba?" is Filipino for "Is it delicious?"

Have you ever been to a restaurant for a second or nth time and can't remember what you've liked from your previous visit/s? 

This app is for you! You can log the food that you ordered and decide if it's masarap (delicious) or not. 

Then next time you visit that restaurant, you'd know what to order again and what to avoid!

May your food always be MASARAP! Enjoy!
`;

function InstructionsScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Instructions</Text>
      <Text style={styles.content}>{instructionsText}</Text>
      {/* <Button title="Go back" onPress={() => navigation.goBack()} /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default InstructionsScreen;

