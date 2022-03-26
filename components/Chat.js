import React from "react";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { 
  Button,
  Text,
  View,
  Platform, 
  KeyboardAvoidingView,
} from 'react-native';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }
  
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello, Welcome to this chat',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ]
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'blue'
          }
        }}
      />
    )
  }

  render() {
    //entered name state from Start screen gets displayed in status bar at the top of the app
    //let name = this.props.route.params.name;
    //his.props.navigation.setOptions({ title: name });

    const { bgColor } = this.props.route.params;

    return (
       
      <View style={{ flex: 1, }}>
        <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
        </View>
    );
  }
}


/*
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
*/


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