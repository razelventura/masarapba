//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Profile.js
//brief: This is Read/View of the selected entry. It will display neatly the information entered by the user. 

import React, {useState, useEffect} from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('masarapbaV2.db');

function ViewProfileScreen({ route, navigation }) {

  // Extract entry data from navigation parameters
  const [entry, setEntry] = useState();
  const { entryId } = route.params;

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM entries WHERE id = ?;",
        [entryId],
        (_, { rows }) => {
          setEntry(rows._array[0]);
        },
        (_, error) => {
          console.error("Failed to fetch entry with id: ", entryId, error);
        }
      );
    });
  }, [entryId]);

  if (!entry) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        {/* Alternatively, show text like "Loading..." */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {entry.pictureUri && <Image source={{ uri: entry.pictureUri }} style={styles.image} />}
      <Text style={styles.text}>Restaurant Name: {entry.restaurantName}</Text>
      <Text style={styles.text}>Date of Visit: {entry.visitDate}</Text>
      <Text style={styles.text}>Name of food/drink: {entry.foodName}</Text>
      <Text style={styles.text}>Masarap Ba: {entry.isDelicious ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>Remarks: {entry.remarks}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 32,
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ViewProfileScreen;
