//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Create.js
//brief: On this page, the user should be able to create/edit an entry.

import React, {useState, useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';


const db = SQLite.openDatabase('masarapbaV2.db');

function CreateScreen({ route, navigation }) {
  const { entry, editMode } = route.params || { entry: null, editMode: false };
  const [restaurantName, setRestaurantName] = useState(entry ? entry.restaurantName : '');
  const [foodName, setFoodName] = useState(entry ? entry.foodName : '');
  const [isDelicious, setIsDelicious] = useState(entry ? entry.isDelicious : true);
  const [remarks, setRemarks] = useState(entry ? entry.remarks : '');
  const [pictureUri, setPictureUri] = useState(entry ? entry.pictureUri : '');

  const [date, setDate] = useState(entry ? new Date(entry.visitDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [visitDate, setVisitDate] = useState(entry ? entry.visitDate : new Date().toISOString().split('T')[0]);

  //Request for permissions for media and camera
  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Vibration.vibrate(100);
      alert('Sorry, we need gallery permissions to make this work!');
    }
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Vibration.vibrate(100);
      alert('Sorry, we need camera permissions to make this work!');
    }
  };

  // Function to use camera to take photo
  const takePhoto = async () => {
    await requestCameraPermissions();
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const uri = result.assets[0].uri; // Accessing the uri from the assets array
      // console.log('Camera Result: ', result); // For debugging
      // console.log('Camera uri: ', uri); // For debugging
      setPictureUri(uri);
    }
  };

  // Function to use media to pick photo
  const choosePhoto = async () => {
    await requestMediaLibraryPermissions();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const uri = result.assets[0].uri; // Accessing the uri from the assets array
      // console.log('Image Picker Result: ', result); // For debugging
      // console.log('Image picker uri: ', uri); // For debugging
      setPictureUri(uri);
    }
  };

  // Handler for date change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (currentDate) {
      // Adjusting date to local time zone before converting to string
      const offset = currentDate.getTimezoneOffset() * 60000; 
      const localDate = new Date(currentDate.getTime() - offset);
      setVisitDate(localDate.toISOString().split('T')[0]);
  }
    setDate(currentDate);
    setShowDatePicker(false); // Close date picker after selection
  };

// Validate entries
  const validateEntry = () => {
    if (!restaurantName || !visitDate || !foodName || pictureUri === null) {
      Vibration.vibrate(100);
      Alert.alert("Error", "Please fill all required fields: Restaurant Name, Visit Date, Food Name, and Picture.");
      return false;
    }
    return true;
  };

  // Save to DB
  const saveEntryToDB = () => {

    if (!validateEntry()) {
      return; // Stop the function if validation fails
    }

    const query = editMode ?
      "UPDATE entries SET pictureUri = ?, restaurantName = ?, visitDate = ?, foodName = ?, isDelicious = ?, remarks = ? WHERE id = ?;" :
      "INSERT INTO entries (pictureUri, restaurantName, visitDate, foodName, isDelicious, remarks) VALUES (?, ?, ?, ?, ?, ?);";
    const params = editMode ?
      [pictureUri, restaurantName, visitDate, foodName, isDelicious ? 1 : 0, remarks, entry.id] :
      [pictureUri, restaurantName, visitDate, foodName, isDelicious ? 1 : 0, remarks];

    db.transaction(tx => {
      tx.executeSql(query, params, (_, result) => {
        const lastId = editMode ? entry.id : result.insertId;
        Vibration.vibrate(200);
        Alert.alert("Success", "Entry has been " + (editMode ? "updated" : "added") + " successfully!");
        navigation.navigate('ViewProfile', {entryId: lastId});
      }, (_, error) => {
        //console.log("DB operation error", error);
        Vibration.vibrate(100);
        Alert.alert("Error", "Failed to " + (editMode ? "update" : "add") + " the entry.");
        Vibration.vibrate(100);
      });
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={setRestaurantName}
        value={restaurantName}
        placeholder="Name of the restaurant"
      />
      <TextInput
        style={styles.textInput}
        onChangeText={setFoodName}
        value={foodName}
        placeholder="Name of food/drink item"
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Text>Masarap ba?</Text>
        <TouchableOpacity onPress={() => setIsDelicious(true)} style={{ marginHorizontal: 10 }}>
          <Text style={{ color: isDelicious ? '#d55314' : 'black' }}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsDelicious(false)}>
          <Text style={{ color: !isDelicious ? '#d55314' : 'black' }}>No</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.textInput}
        onChangeText={setRemarks}
        value={remarks}
        placeholder="Remarks"
        multiline
      />
      <Text> Date Selected: {visitDate ? visitDate : "None"} </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
      <TouchableOpacity style={styles.buttonStyle} onPress={() => setShowDatePicker(true)}>
          <Icon name="calendar-month" size={24} color="#FFFFFF" />
          <Text style={styles.buttonTextSmall}>{(visitDate ? "Change" : "Add") + " Date"}</Text>
          {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
            style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}
          />
        )}
        </TouchableOpacity>
        </View>
      <Text> Picture Selected: { pictureUri ? "" : "None"} </Text>
      {pictureUri && (
        <Image source=
        {{ uri: pictureUri }} 
        style={{     
          width: '100%',
          height: 200,
          resizeMode: 'contain',
          margin: 10, 
        }} />
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

      <TouchableOpacity style={styles.buttonStyle} onPress={takePhoto}>
        <Icon name="camera-alt" size={24} color="#FFFFFF" />
        <Text style={styles.buttonTextSmall}>{(pictureUri ? "Retake Pic" : "Take a Pic")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonStyle} onPress={choosePhoto}>
        <Icon name="photo-library" size={24} color="#FFFFFF" />
        <Text style={styles.buttonTextSmall}>{(pictureUri ? "Choose New Pic" : "Choose Pic")}</Text>
      </TouchableOpacity>

{/* 
        <TouchableOpacity style={styles.buttonStyle} onPress={takePhoto}>
            <Text style={styles.buttonText}>{(pictureUri ? "Retake Pic" : "Take a Pic")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={choosePhoto}>
            <Text style={styles.buttonText}>{(pictureUri ? "Choose New Pic" : "Choose Pic")}</Text>
          </TouchableOpacity> */}

      </View>

      <TouchableOpacity style={[styles.buttonStyle, {marginBottom: 40, backgroundColor: '#d55314'}]} onPress={saveEntryToDB}>
          <Text style={[styles.buttonText,{color: '#ffffff', fontSize: 16}]}>Save Entry</Text>
        </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#d8a88b',
    padding: 20, 
  },
  textInput: {
    height: 40, 
    borderColor: '#d55314',
    borderWidth: 1, 
    marginBottom: 20, 
    padding: 10
  },
  buttonContainer: {
    //flex: 1,
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    alignItems: 'center', 
    //justifyContent: 'right', 
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: '#df7859',  
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
    color: 'black',            
    fontSize: 14,                
    //fontWeight: 'bold',          
},
buttonTextSmall: {
  color: 'white',            
  fontSize: 13,   
  paddingTop: 5,             
  //fontWeight: 'bold',      
  textAlign: 'center',          
},
});

export default CreateScreen;
