//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Profile.js
//brief: This is Read/View of the selected entry. It will display neatly the information entered by the user. 

import React, {useState, useEffect, useCallback} from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const db = SQLite.openDatabase('masarapbaV2.db');

function ViewProfileScreen({ route, navigation }) {

  // Extract entry data from navigation parameters
  const [entry, setEntry] = useState(null);
  const { entryId } = route.params;

  const fetchEntry = () => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM entries WHERE id = ?;",
        [entryId],
        (_, { rows }) => {
          setEntry(rows._array[0]);
        },
        (_, error) => {
          //console.error("Failed to fetch entry with id: ", entryId, error);
        }
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchEntry();
    }, [entryId])
  );

  if (!entry) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  const deleteRecord = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "delete from entries where id = ?;",
          [id],
          (_, success) => {
            //console.log("Delete successful:", success);
            // Vibrate to indicate success
            Vibration.vibrate(200) // 200ms
            Alert.alert(
              "Delete Successful",
              "The entry has been deleted.",
              [
                {
                  text: "OK", onPress: () => navigation.navigate('ViewEntries')
                }
              ],
              { cancelable: false }
            );
          },
          (_, error) => {
            //console.error("Delete failed:", error);
            Vibration.vibrate(100);
            Alert.alert(
              "Delete Failed",
              "There was a problem deleting the entry."
            );
          }
        );
      }
    );
  }
  
  const areYouSure = (id) => {
    // Show confirmation dialog before deleting
    Vibration.vibrate(100);
    Alert.alert(
      "Delete Item", // Alert Title
      "Are you sure you want to delete this entry?", // Alert Message
      [
        {
          text: "Cancel",
          //onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => deleteRecord(id) }
      ],
      { cancelable: false }
    );
  }  

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: entry.isDelicious 
          ? 'https://citweb.lethbridgecollege.ab.ca/MobileApp/happy-face.png'
          : 'https://citweb.lethbridgecollege.ab.ca/MobileApp/meh-face.png'
        }}
        style={styles.face}
      />
      {entry.pictureUri && <Image source={{ uri: entry.pictureUri }} style={styles.image} />}
      <Text style={styles.text}>Restaurant Name: {entry.restaurantName}</Text>
      <Text style={styles.text}>Date of Visit: {entry.visitDate}</Text>
      <Text style={styles.text}>Name of food/drink: {entry.foodName}</Text>
      <Text style={styles.text}>Masarap Ba: {entry.isDelicious ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>Remarks: {entry.remarks ? entry.remarks : "None"}</Text>

      <View style={styles.buttonContainer}>

        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Create', { entry: entry, editMode: true })}>
          <Icon name="edit" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} onPress={() => areYouSure(entry.id)}>
          <Icon name="delete" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Create')}>
          <Icon name="add" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('ViewEntries')}>
          <Icon name="list" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>List</Text>
        </TouchableOpacity>

{/*         <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Create', { entry: entry, editMode: true })}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => areYouSure(entry.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('ViewEntries')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity> */}

      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    //margin: 20,
    backgroundColor: '#d8a88b',
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
    height: 225,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  buttonContainer: {
    //flex: 1,
    flexDirection: 'row', 
    //flexWrap: 'wrap', 
    alignItems: 'center', 
    //justifyContent: 'right', 
    padding: 10,
  },
  buttonStyle: {
    width: 80,
    height: 80,
    backgroundColor: '#d55314',  
    paddingVertical: 12,         
    paddingHorizontal: 20,       
    borderRadius: 10,            
    margin: 5,
    shadowColor: '#000',         
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,         
    shadowRadius: 3.84,          
    elevation: 5,                
    marginVertical: 10,          
    alignItems: 'center',        
    justifyContent: 'center',    
},

buttonText: {
    color: '#FFFFFF',            
    fontSize: 13,   
    paddingTop: 5,             
    //fontWeight: 'bold',      
    textAlign: 'center',    
},
});

export default ViewProfileScreen;
