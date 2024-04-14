//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Summary.js
//brief: This is the summary page. The user would be able to see all the entries in scrollable view. 
    //The entries will be sorted alphabetically according to restaurant name

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';

function ViewSummaryScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  //const navigation = useNavigation();

  useEffect(() => {
    const fetchEntries = async () => {

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

  // Retrieve the sorted entries
  const getSortedEntries = () => {
    db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM entries ORDER BY restaurantName ASC, visitDate DESC;",
      [],
      (_, { rows }) => { setEntries(rows._array); },
      (_, error) => { console.log("Error", error); }
        );
      });
    };

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