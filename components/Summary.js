//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Summary.js
//brief: This is the summary page. The user would be able to see all the entries in scrollable view. 
    //The entries will be sorted alphabetically according to restaurant name

import React, { useEffect, useState } from 'react';
import { BackHandler, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const db = SQLite.openDatabase('masarapbaV2.db');

function ViewSummaryScreen() {
  const navigation = useNavigation();
  const [entries, setEntries] = useState([]);
  const isFocused = useIsFocused(); 
  const [searchText, setSearchText] = useState('');

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
  }, [isFocused,searchText]); 

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
    let query = "SELECT * FROM entries ";
    if (searchText) {
      query += `WHERE restaurantName LIKE '%${searchText}%' 
                OR foodName LIKE '%${searchText}%'
                OR visitDate LIKE '%${searchText}%'
                OR remarks LIKE '%${searchText}%'    
              ORDER BY restaurantName ASC, visitDate DESC;`;
    } else {
      query += "ORDER BY restaurantName ASC, visitDate DESC;";
    }
    db.transaction(tx => {
      tx.executeSql(
        query,
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
            ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Fluent_Emoji_Color_1f63b.svg/640px-Fluent_Emoji_Color_1f63b.svg.png'
            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Fluent_Emoji_Color_1f63f.svg/640px-Fluent_Emoji_Color_1f63f.svg.png'
        }}
        style={styles.face}
      />
      {/* One Line: <Text style={styles.textWrap}>{item.restaurantName} - {item.visitDate} - {item.foodName} </Text> */}
      {/* Three Lines: <Text style={styles.textWrap}>{item.restaurantName}{"\n"}{item.foodName}{"\n"}{item.visitDate}</Text> */}
      <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="storefront" size={15} color="#d55314" />
          <Text style={styles.textWrap}> {item.restaurantName}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="fastfood" size={15} color="#d55314" />
          <Text style={styles.textWrap}> {item.foodName}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="event" size={15} color="#d55314" />
          <Text style={styles.textWrap}> {item.visitDate}</Text>
          </View>

      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
      />
      
      <FlatList
      data={entries}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={() => (
        <Text style={styles.emptyMessage}>No entries found. </Text>
      )}
    />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Create',{})}
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
    borderColor: '#d55314',
    alignItems: 'center', 
    flex: 1,
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
  searchInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '90%',
    borderRadius: 10,
    borderColor: '#d55314',
    backgroundColor: '#ffffff',
  },
  textWrap: {
    fontSize: 14,
    lineHeight: 24, // Increase line height for better readability on wrap
    flexShrink: 1, // Allows text to wrap in the flex container
    color: 'black',
  },
});

export default ViewSummaryScreen;