//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Summary.js
//brief: This is the summary page. The user would be able to see all the entries in scrollable view. 
    //The entries will be sorted alphabetically according to restaurant name

import React from 'react';
import { View, Text, Button } from 'react-native';

function ViewSummaryScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>View Existing Entries</Text>
      {/* TO DO: Add code for viewing entries */}
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default ViewSummaryScreen;