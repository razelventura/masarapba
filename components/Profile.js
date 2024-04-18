//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Profile.js
//brief: This is Read/View of the selected entry. It will display neatly the information entered by the user. 

import React, {useState, useEffect, useCallback} from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const db = SQLite.openDatabase('masarapbaV2.db');

function ViewProfileScreen({ route, navigation }) {

  // Extract entry data from navigation parameters
  const [entry, setEntry] = useState(null);
  const { entryId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

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
          ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Fluent_Emoji_Color_1f63b.svg/640px-Fluent_Emoji_Color_1f63b.svg.png'
          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Fluent_Emoji_Color_1f63f.svg/640px-Fluent_Emoji_Color_1f63f.svg.png'
        }}
        style={styles.face}
      />

      <ScrollView style={{ flex: 1,flexDirection: 'column',padding: 20, paddingBottom: 50 }}> 

      <TouchableOpacity
        onPress={() => setModalVisible(true)}>
        {entry.pictureUri && <Image source={{ uri: entry.pictureUri }} style={styles.image} />}
      </TouchableOpacity>

      <Modal
          animationType="fade"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            //Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={{ uri: entry.pictureUri }} style={styles.modalImage} />
              <TouchableOpacity
                style={styles.hideModalButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={{color: 'white'}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
      
       <View style={{flexDirection: 'row', alignItems: 'center',flexWrap: 'wrap'}}>
          <Icon name="storefront" size={20} color="#d55314"/>
          <Text style={styles.textWrap}> Restaurant:</Text>
          <Text style={[styles.textWrap,{color:'black'}]}> {entry.restaurantName} </Text>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="event" size={20} color="#d55314" />
          <Text style={styles.textWrap}> Visit Date: </Text>
          <Text style={[styles.textWrap,{color:'black'}]}> {entry.visitDate} </Text>
      </View>
          
      <View style={{flexDirection: 'row', alignItems: 'center',flexWrap: 'wrap'}}>
          <Icon name="fastfood" size={20} color="#d55314" />
          <Text style={styles.textWrap}> Food/Drink Item: </Text>
          <Text style={[styles.textWrap,{color:'black'}]}>{entry.foodName} </Text>
      </View>
          
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="thumbs-up-down" size={20} color="#d55314" />
          <Text style={styles.textWrap}> Masarap Ba: </Text>
          <Text style={[styles.textWrap,{color:'black'}]}> {entry.isDelicious ? 'Yes' : 'No'} </Text>
      </View>
          

      <View style={{flexDirection: 'row', alignItems: 'center',flexWrap: 'wrap', paddingBottom: 50}}>
          <Icon name="description" size={20} color="#d55314" />
          <Text style={styles.text}> Remarks: </Text>  
          <Text style={[styles.textWrap,{color:'black'}]}>{entry.remarks ? entry.remarks : "None"}  </Text>
      </View>     

      </ScrollView>
      
      <View style={styles.buttonContainer}>

        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Create', { entry: entry, editMode: true })}>
          <Icon name="edit" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} onPress={() => areYouSure(entry.id)}>
          <Icon name="delete" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>

{/*         Removing this because it keeps on going back to edit mode.
        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Create',{})}>
          <Icon name="add" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('ViewEntries')}>
          <Icon name="list" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>View All</Text>
        </TouchableOpacity>

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
    color: "#d55314",
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  image: {
    width: 280,
    height: 180,
    resizeMode: 'cover',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
    width: 79,
    height: 55,
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
    fontSize: 10,   
    paddingTop: 5,             
    //fontWeight: 'bold',      
    textAlign: 'center',    
},
output: {
  flexDirection: 'row', 
  alignItems: 'center', 
  //padding: 20, 
  //marginLeft: 10,
  //marginRight: 10,
  //flexShrink: 1
},
textWrap: {
  fontSize: 16,
  lineHeight: 24, 
  flexShrink: 1, 
  color: '#d55314',
},
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22
},
modalView: {
  margin: 20,
  //backgroundColor: "#d55314",
  borderRadius: 20,
  padding: 30,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5
},
modalImage: {
  width: 400 * 0.80, 
  height: 300 * 0.80, 
  borderRadius: 20,
},  
hideModalButton: {
  marginTop: 15,
  backgroundColor: '#d55314', 
  borderRadius: 10,
  padding: 10,
  elevation: 2, 
},

});


export default ViewProfileScreen;
