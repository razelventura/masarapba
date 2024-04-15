//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Summary.js
//brief: This is the summary page. The user would be able to see all the entries in scrollable view. 
    //The entries will be sorted alphabetically according to restaurant name

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('masarapbaV2.db');

function ViewSummaryScreen({ navigation }) {
  const [entries, setEntries] = useState([]);

  //Logging for debugging
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
  },[])

  useEffect(() => {
    const fetchEntries = async () => {
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM entries ORDER BY restaurantName ASC, visitDate DESC;",
          [],
          (_, { rows }) => {
            setEntries(rows._array);
          },
          (_, error) => {
            console.error("Failed to fetch entries: ", error);
          }
        );
      });
    };

    fetchEntries();
  },[])

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ViewProfile', { entry: item })}
      style={{ padding: 20, borderBottomWidth: 1, borderColor: '#ccc' }}
    >
      <Text>{item.restaurantName} - {item.visitDate}</Text>
      {/* Display more details if needed */}
    </TouchableOpacity>
  );


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>View Existing Entries</Text>
      <FlatList
      data={entries}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
    </View>
  );
}

export default ViewSummaryScreen;