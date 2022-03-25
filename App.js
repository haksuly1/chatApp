import { StyleSheet } from 'react-native';
// importing screens we want to navigate between
import Start from './components/Start';
import Chat from './components/Chat';

import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// create navigator
const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start">
          <Stack.Screen
            name="Start"
            component={Start} />
          <Stack.Screen
            name="Chat"
            component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

// style sheet at the bottom
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
//IMPLEMENT BOTTOM TAB

import React, { Component } from 'react';
//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
//import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Create the navigator
//const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  //contructor(props) {
  //super(props);
  //this.state = { text: "" };

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Start">
          <Tab.Screen name="Start" component={Start} />
          <Tab.Screen name="Chat" component={Chat} />
        </Tab.Navigator>
      </NavigationContainer>
    )
  }
}
*/


/*
//EXAMPLE CHANGING SCREENS

import React, { Component } from 'react';
//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { createButtomTabNavigator } from '@react-navigation/bottom-tabs';
// Create the navigator
const Stack = createStackNavigator();

export default class App extends React.Component {
  //contructor(props) {
  //super(props);
  //this.state = { text: "" };

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Screen1">
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
*/