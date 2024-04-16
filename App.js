//Mobile App Devt (CIT2269) Final Project
//author: Razel Ventura, s0541328
//date: 2024-04-19
//App.js
//brief: This is the main page that the users will see after the splash screen. 
    //They can choose here to view the instructions, add an entry, or view existing entries

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          //headerTitle:'Nav Example',
          headerStyle: { backgroundColor: '#d55314'},
          headerTintColor: 'white',
          headerShown: true,
          headerBackVisible: true,
          headerTitleAlign: 'center',
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
          options={({ navigation }) => ({
            title: 'View All Entries',
          })}
        />
        <Stack.Screen
          name="ViewProfile"
          component={ViewProfileScreen}
          options={({ navigation }) => ({
            title: 'View Entry',
            headerBackVisible: false,
          })}
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Instructions')}>
          <Text style={styles.buttonText}>About this App</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Create')} >
          <Text style={styles.buttonText}>Add an Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('ViewEntries')}>
          <Text style={styles.buttonText}>View Entries</Text>
        </TouchableOpacity>
      </View>



      <StatusBar style="auto" />
    </View>
  );
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8a88b', //#2f2922 #c2b6a8
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold'
  },
  buttonContainer: {
    alignItems: 'center', 
    padding: 10,
  },
  buttonStyle: {
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
    elevation: 5,                // Elevation for Android
    marginVertical: 10,          
    alignItems: 'center',        
    justifyContent: 'center',    
},

buttonText: {
    color: '#FFFFFF',            
    fontSize: 16,                
    //fontWeight: 'bold',          
},
});
