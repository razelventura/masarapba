//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Create.js
//brief: On this page, the user should be able to create/add an entry.

import React from 'react';
import { View, Text, Button } from 'react-native';

function CreateScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Add an Entry</Text>
      {/* TO DO: Add code for adding entry */}
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default CreateScreen;