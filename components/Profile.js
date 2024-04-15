//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Profile.js
//brief: This is Read/View of the selected entry. It will display neatly the information entered by the user. 

import React from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

function ViewProfileScreen({ route, navigation }) {

  // Extract entry data from navigation parameters
  const { entry } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {entry.pictureUri && <Image source={{ uri: entry.pictureUri }} style={styles.image} />}
      <Text>Restaurant Name: {entry.restaurantName}</Text>
      <Text>Date of Visit: {entry.visitDate}</Text>
      <Text>Name of food/drink: {entry.foodName}</Text>
      <Text>Masarap Ba: {entry.isDelicious ? 'Yes' : 'No'}</Text>
      <Text>Remarks: {entry.remarks}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
});

export default ViewProfileScreen;
