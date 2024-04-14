//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Create.js
//brief: On this page, the user should be able to create/add an entry.

import React, {useState} from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker'

const db = SQLite.openDatabase('masarapba.db');

function CreateScreen({ navigation }) {

  const [restaurantName, setRestaurantName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  // Placeholder function for taking a picture
    const takePhoto = async () => {
      await requestCameraPermissions();
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setPictureUri(result.uri);
      }
    };

  
    const choosePhoto = async () => {
      await requestMediaLibraryPermissions();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setPictureUri(result.uri);
      }
    };

  // Update the date in the state when changed
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setVisitDate(currentDate.toISOString().split('T')[0]);
  };

  // When the user confirms the addition of a new entry
  const saveEntryToDB = (pictureUri, restaurantName, visitDate, isDelicious) => {
  db.transaction(tx => {
    tx.executeSql(
      "INSERT INTO entries (pictureUri, restaurantName, visitDate, isDelicious, remarks) values (?, ?, ?, ?, ?);",
      [pictureUri, restaurantName, visitDate, isDelicious ? 1 : 0],
      (_, { rows }) => { console.log("Success", rows); },
      (_, error) => { console.log("Error", error); }
    );
  },
  null, 
  () => {
    Alert.alert("Success", "Entry added successfully");
    navigation.goBack();
 }
  );
};

return (
  <View style={{ flex: 1, padding: 20 }}>
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
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
          style={{ width: '100%', alignItems: 'center' }}
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
      style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
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