//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Create.js
//brief: On this page, the user should be able to create/add an entry.

import React, {useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, Vibration, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker'

const db = SQLite.openDatabase('masarapbaV2.db');

function CreateScreen({ navigation }) {

  const [restaurantName, setRestaurantName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [isDelicious, setIsDelicious] = useState(true); // Default is yes
  const [remarks, setRemarks] = useState('');
  const [pictureUri, setPictureUri] = useState('');

  // ISO string date format for visitDate
    const [visitDate, setVisitDate] = useState(date.toISOString().split('T')[0]);

  //Request for permissions for media and camera
  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need gallery permissions to make this work!');
    }
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
    }
  };

  // Use useEffect to trigger database save after pictureUri state updates
  useEffect(() => {
    if (pictureUri) {
      saveEntryToDB();
    }
  }, [pictureUri]); // This will trigger saveEntryToDB when pictureUri changes

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
        console.log('Camera Result: ', result); // For debugging
        console.log('Camera uri: ', uri); // For debugging
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
        console.log('Image Picker Result: ', result); // For debugging
        console.log('Image picker uri: ', uri); // For debugging
        setPictureUri(uri);
      }
    };

  // Update the date in the state when changed
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setVisitDate(currentDate.toISOString().split('T')[0]);
  };

  // When the user confirms the addition of a new entry
  const saveEntryToDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      "INSERT INTO entries (pictureUri, restaurantName, visitDate, foodName, isDelicious, remarks) values (?, ?, ?, ?, ?, ?);",
      [pictureUri, restaurantName, visitDate, foodName, isDelicious ? 1 : 0, remarks],
      (_, { rows }) => { console.log("Success", rows._array); },
      (_, error) => { console.log("Error", error); }
    );

    //Get the last inserted row ID
    tx.executeSql(
      "SELECT last_insert_rowid() as id;",
      [],
      (_, { rows }) => {
        const lastId = rows._array[0].id; 
        console.log("Last ID", lastId);
        // Navigate to the profile of the latest entry
        navigation.navigate('ViewProfile', { entryId: lastId });
      },
      (_, error) => {
        console.error("Failed to retrieve last inserted id: ", error);
      }
    );
  },
  null, 
  () => {
    Alert.alert("Success", "Entry added successfully");
    
    // Vibrate to indicate success
    Vibration.vibrate(200) // 200ms
  }
  );
};

return (
  <View style={{ flex: 1, padding: 20 }}>
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
      onChangeText={setRestaurantName}
      value={restaurantName}
      placeholder="Name of the restaurant"
    />
    <Text> Date of Visit</Text>
      <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}
        />

    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
      onChangeText={setFoodName}
      value={foodName}
      placeholder="Name of food/drink item"
    />
     <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      <Text>Masarap ba?</Text>
      <TouchableOpacity onPress={() => setIsDelicious(true)} style={{ marginHorizontal: 10 }}>
        <Text style={{ color: isDelicious ? 'blue' : 'black' }}>Yes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsDelicious(false)}>
        <Text style={{ color: !isDelicious ? 'blue' : 'black' }}>No</Text>
      </TouchableOpacity>
    </View>
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
      onChangeText={setRemarks}
      value={remarks}
      placeholder="Remarks"
      multiline
    />
    <Button title="Take a Photo" onPress={takePhoto} />
    <Button title="Choose from Gallery" onPress={choosePhoto} />
    <Button title="Save Entry" onPress={saveEntryToDB} />
  </View>
);
}

export default CreateScreen;