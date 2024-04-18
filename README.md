# MASARAP BA?


Mobile App Devt (CIT2269)  
Final Project 
Author: Razel Ventura, s0541328  
Date: April 19, 2024  
//.readme  
Brief: An explanation of the thinking process / considerations / installations needed for the Masarap Ba app.  

## PURPOSE 

"Masarap ba?" is Filipino for "Is it delicious?"

Have you ever been to a restaurant for a second or nth time and can't remember what you've liked from your previous visit/s? 
This app is for you. You can log the food that you ordered and decide if it's masarap (delicious) or not. Then next time you visit that restaurant, you'd know what to order again and what to avoid!

## INSTALLATIONS

``` npx expo install expo-splash-screen ```
``` npm install react-native-safe-area-context@4.8.2 ```
``` npm install react-native-screens@~3.29.0 ```
``` npx expo install expo-sqlite ```
``` npx expo install @react-native-community/datetimepicker ```
``` npx expo install expo-image-picker ```
``` npm install @expo/vector-icons ```
``` npm install react-native-vector-icons ```


## HOW WERE THE GOALS MET
### Your app must have a functional user interface using a variety of controls
Some of the controls used are:  
-Activity Indicator  
-Alert  
-Button  
-Image  
-Scroll View  
-Text  
-Text Input  
-TouchableOpacity  
-useEffect  
-useState  
-Vibration (200ms for success, 100ms for warning or error)  

### Your app must demonstrate local storage (file and/or database)
SQLite was used to store data from the user.

### Your app must demonstrate the use of an outside resource (i.e. from the internet)
The happy and disappointed faces used to indicate if masarap ba are fetching from Wikimedia Commons. 

### Your app must be deployable on an Android Platform
Yes.

## NOTE TO STEPHEN
This was tested on both Android and iOS. The date picker will not work for iOS. The one implemented here is specifically for Android.
