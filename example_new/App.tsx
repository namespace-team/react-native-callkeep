import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Demo from "./src/Demo";
import { StatusBar } from "react-native";

import { PermissionsAndroid, Platform } from 'react-native';
import RNCallKeep from "react-native-callkeep";
import { useEffect } from "react";

async function requestCallKeepPermissions() {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
      // PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ];

      // Add READ_PHONE_NUMBERS for Android 12+
    if (Platform.Version >= 31) {
      permissions.push(PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS);
    }
      
      // // Android 12+
      // if (Platform.Version >= 31) {
      //   permissions.push(PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS);
      //   permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      // }
      
      // // Android 13+
      // if (Platform.Version >= 33) {
      //   permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      // }

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED
      );
      
      console.log('Permissions granted:', allGranted);
      console.log('Individual permissions:', granted);
      
      return allGranted;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }
  return true;
}

// / In your component or App.js
async function setupCallKeep() {
  // IMPORTANT: Request permissions BEFORE setting up CallKeep
  const hasPermissions = await requestCallKeepPermissions();

  if (!hasPermissions) {
    console.warn('Required permissions not granted');
    // Optionally show an alert to the user
    return;
  }

  // Now setup CallKeep
  const options = {
    ios: {
      appName: 'CallKeepDemo',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'OK',
      additionalPermissions: [],
      selfManaged: false,
    },
  };

  try {
    await RNCallKeep.setup(options);
    console.log('CallKeep setup successful');
  } catch (err) {
    console.error('CallKeep setup error:', err);
  }
}


export default function App(){

  useEffect(() => {
    setupCallKeep();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <StatusBar barStyle="dark-content" />
      <Demo />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}