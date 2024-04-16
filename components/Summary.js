//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Summary.js
//brief: This is the summary page. The user would be able to see all the entries in scrollable view. 
    //The entries will be sorted alphabetically according to restaurant name

import React, { useEffect, useState } from 'react';
import { BackHandler, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const db = SQLite.openDatabase('masarapbaV2.db');

function ViewSummaryScreen() {
  const navigation = useNavigation();
  const [entries, setEntries] = useState([]);
  const isFocused = useIsFocused(); 

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;  // This will stop the default back action
    };

    if (isFocused) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, [isFocused, navigation]); 

  // Fetch entries when the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchEntries(); 
    }
  }, [isFocused]); 

/*   //Logging for debugging
  useEffect(()=>{
    const logEntries = () => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM entries;',
          [],
          (_, { rows }) => console.log(JSON.stringify(rows._array)),
          (_, error) => console.error(error)
        );
      });
    };  
    logEntries();
  },[]) */

    const fetchEntries = () => {
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM entries ORDER BY restaurantName ASC, visitDate DESC;",
          [],
          (_, { rows }) => {
            setEntries(rows._array);
          },
          (_, error) => {
            //console.error("Failed to fetch entries: ", error);
          }
        );
      });
    };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ViewProfile', { entryId: item.id })}
      style={styles.itemContainer}
    >
      <Image
        source={{
          uri: item.isDelicious
            ? 'https://citweb.lethbridgecollege.ab.ca/MobileApp/happy-face.png'
            : 'https://citweb.lethbridgecollege.ab.ca/MobileApp/meh-face.png'
        }}
        style={styles.face}
      />
      <Text>{item.restaurantName} - {item.visitDate} - {item.foodName} </Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      
      <FlatList
      data={entries}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={() => (
        <Text style={styles.emptyMessage}>No entries found. {"\n"} Add a new entry with the + button below. </Text>
      )}
    />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Create')}
      >
        <AntDesign name="pluscircle" size={60} color="#d55314" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d8a88b',
    position: 'relative', 
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center' 
  },
  face: {
    width: 50,
    height: 50,
    marginRight: 20 
  },
  addButton: {
    position: 'absolute', // Position the button absolutely
    right: 30, // Distance from the right edge
    bottom: 30, // Distance from the bottom edge
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'black'
  },
});

export default ViewSummaryScreen;