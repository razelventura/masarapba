//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Profile.js
//brief: This is Read/View of the selected entry. It will display neatly the information entered by the user. 

import React from 'react';
import { View, Text, Button } from 'react-native';

function ViewProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>View Profile</Text>
      {/* TO DO: Code for viewing profile */}
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default ViewProfileScreen;
