//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//Create.js
//brief: On this page, the user should be able to create/edit an entry.

import React, {useState, useEffect } from 'react';
import { Alert, View, Image, Text, TextInput, TouchableOpacity, Vibration, Button, Platform, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';

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
      alert('Sorry, we need gallery permissions to make this work!');
    }
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
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
      setPictureUri(result.uri);
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
      setPictureUri(result.uri);
    }
  };

  // Handler for date change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setVisitDate(currentDate.toISOString().split('T')[0]);
    setShowDatePicker(false); // Close date picker after selection
  };

  // Save to DB
  const saveEntryToDB = () => {
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
        console.log("DB operation error", error);
        Alert.alert("Error", "Failed to " + (editMode ? "update" : "add") + " the entry.");
      });
    });
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
        onChangeText={setRestaurantName}
        value={restaurantName}
        placeholder="Name of the restaurant"
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
      {pictureUri && (
        <Image source={{ uri: pictureUri }} style={{ width: '100%', height: 200, resizeMode: 'contain', marginBottom: 20 }} />
      )}
      <Button title={(editMode ? "Change" : "Add") + " Date"} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}
        />
      )}
      <Button title="Take a Photo" onPress={takePhoto} />
      <Button title="Choose from Gallery" onPress={choosePhoto} />
      <Button title="Save Entry" onPress={saveEntryToDB} />
    </ScrollView>
  );
}

export default CreateScreen;
