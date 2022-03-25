import React from 'react';
import { View, Text, Button } from 'react-native';

export default class Chat extends React.Component {
  render() {
    //entered name state from Start screen gets displayed in status bar at the top of the app
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    const { bgColor } = this.props.route.params;

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor
      }}>
        <Text>Start chat!</Text>
        <Button
          title="Go to home page"
          onPress={() => this.props.navigation.navigate('Start')}
        />
      </View>
    )
  }
}



/*
import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

export default class Chat extends React.Component {
  //contructor(props) {
  //super(props);
  //this.state = { text: "" };
  //}
  render() {
    //let name = this.props.route.params.name;
    //this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello Screen2!</Text>
        <Button
          title="Go to Start"
          onPress={() => this.props.navigation.navigate('Start')} 
          />
      </View>
    );
  }
}
*/