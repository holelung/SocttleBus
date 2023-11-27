import React,{ useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./src/screens/home";
import LoginScreen from './src/screens/loginScreen';
import Join from './src/screens/join';
import MyPage from './src/screens/mypage';
import QRCodeScreen from './src/screens/qrcode';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Axios from 'axios';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Join" component={Join} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  
});


export default App;
