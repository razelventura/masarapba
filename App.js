//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//App.js
//brief: This is the main page that the users will see after the splash screen. 
    //They can choose here to view the instructions, add an entry, or view existing entries

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
/* import instructionsText from './components/Instructions'; */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateScreen from './components/Create';
import ViewSummaryScreen from './components/Summary';
import ViewProfileScreen from './components/Profile';
import InstructionsScreen from './components/Instructions';
import * as SQLite from 'expo-sqlite';

const Stack = createNativeStackNavigator();


// Prevent the splash screen from hiding immediately
SplashScreen.preventAutoHideAsync();

// Banner image
const masarapBanner = require('./assets/masarapbanner.png'); 

// Open the database; create it if it doesn't exist
const db = SQLite.openDatabase('masarapbaV2.db');

// Initialize the database
function initDB() {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, pictureUri TEXT, restaurantName TEXT, visitDate DATE, foodName TEXT, isDelicious INTEGER, remarks TEXT);"
    );
  }, (error) => {
    console.error("Error creating tables", error);
  });
}

export default function App() {

  //Splash screen
  useEffect(() => {
    async function prepare() {

      // Initialize the database when the app starts
      initDB();

      // Wait 4 seconds
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Hide the splash screen
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

/*   //Instructions
  const showInstructions = () => {
    Alert.alert("About 'Masarap Ba?'", instructionsText, [{ text: "OK" }]);
  }; */

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          //headerTitle:'Nav Example',
          headerStyle: { backgroundColor: 'gray'},
          headerTintColor: 'white',
          headerShown: true,
          headerBackVisible: true,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Create"
          component={CreateScreen}
          options={{title: 'Add a New Entry'}}
        />
        <Stack.Screen
          name="ViewEntries"
          component={ViewSummaryScreen}
          options={{title: 'View All Entries'}}
        />
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfileScreen}
          options={{title: 'View Entry'}}
        />
        <Stack.Screen
          name="Instructions"
          component={InstructionsScreen}
          options={{title: 'About Masarap Ba'}}
        />

        </Stack.Navigator>

    </NavigationContainer>
  );
function HomeScreen ({ navigation }) {
  return (
    <View style={styles.container}>
      <Image style= {{height:200}}
        source={masarapBanner}
        resizeMode="contain"
      />
      {/* <Text style={styles.headerText}>MASARAP BA?</Text> */}
      <Button title="About this App" onPress={() => navigation.navigate('Instructions')} />
      <Button title="Add an Entry" onPress={() => navigation.navigate('Create')} />
      <Button title="View Entries" onPress={() => navigation.navigate('ViewEntries')} />
      <StatusBar style="auto" />
    </View>
  );
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold'
  },
});
