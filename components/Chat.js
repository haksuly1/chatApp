import React, { Component } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { Bubble, GiftedChat, SystemMessage, Day, InputToolbar, Actions } from 'react-native-gifted-chat';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";

import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFhmxIht5COEi0wj7DqWWfYGLsHMgw-_A",
  authDomain: "chatapp-54327.firebaseapp.com",
  projectId: "chatapp-54327",
  storageBucket: "chatapp-54327.appspot.com",
  messagingSenderId: "827067780806",
  appId: "1:827067780806:web:f1d30475cbbc1097e051c7",
  measurementId: "G-BP9161N37T"
};

LogBox.ignoreAllLogs();

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: { _id: "", name: "", avatar: "" },
      isConnected: false,
      image: null,
      location: null,
    };

    //initializing firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    // reference to the Firestore messages collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.refMsgsUser = null;
  }

  onCollectionUpdate = QuerySnapshot => {
    const messages = [];
    // go through each document
    QuerySnapshot.forEach(doc => {
      // get the queryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages: messages,
    });
  };

  // get messages from AsyncStorage
  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // save messages on the asyncStorage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(this.state.messages));
    } catch (err) {
      console.log(err.message);
    }
  };


  // saves user to asyncStorage: necessary to display message bubbles on the correct side while offline
  async saveUser() {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(this.state.user));
    } catch (err) {
      console.log(err.message);
    }
  }


  // get user from AsyncStorage
  async getUser() {
    let user = '';
    try {
      user = await AsyncStorage.getItem('user') || [];
      this.setState({
        user: JSON.parse(user)
      });
    } catch (err) {
      console.log(err.message);
    }
  }


  // delete message from asyncStorage
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // check the user connection status, online?
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");
        // listens for updates in the collection
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);

        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
              return await firebase.auth().signInAnonymously();
            }

            // update user state with currently active data
            this.setState({
              uid: user.uid,
              messages: [],
              user: {
                _id: user.uid,
                name: name,
                avatar: 'https://placeimg.com/140/140/any',
              },
            });

            //referencing messages of current user
            this.refMsgsUser = firebase
              .firestore()
              .collection("messages")
              .where("uid", "==", this.state.uid);
          });
        // save messages locally to AsyncStorage
        this.saveMessages();
      } else {
        // the user is offline
        this.setState({ isConnected: false });
        console.log("offline");
        this.getMessages();
      }
    });
  }

  addMessages() {
    const message = this.state.messages[0];
    // add a new message to the collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image || '',
      location: message.location || null
    });
  }

  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();
        this.addMessages();
      });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          }
        }}
      />
    )
  };

  renderSystemMessage(props) {
    return (
    <SystemMessage 
    {...props} 
    textStyle={{ 
      color: "#fff" 
    }} 
    />
  );
  }

  renderDay(props) {
    return (
      <Day
        {...props}
        textStyle={{
          color: '#fff',
        }}
      />
    );
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }
  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }


  // Returns a mapview when user adds a location to current message
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  // action button to access communication features via an action sheet
  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }



  render() {
    const { bgColor } = this.props.route.params;
    const { user } = this.state;
    //let name = this.props.route.params.name;
    //this.props.navigation.setOptions({ title: name });

    //let bgColor = this.props.route.params.bgColor;

    return (
      <View style={{ flex: 1, backgroundColor: bgColor ? bgColor : '#fff' }}>
        <GiftedChat
          renderBubble={this.renderBubble}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderDay={this.renderDay}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: user._id,
            name: user.name,
            avatar: user.avatar
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}

    /*
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bgColor ? bgColor : "#fff",
        }}>

        <View style={{ flex: 1, backgroundColor: bgColor ? bgColor : "#fff" }}>
          <GiftedChat
            //style={styles.giftedChat}
            renderBubble={this.renderBubble.bind(this)}
            renderSystemMessage={this.renderSystemMessage.bind(this)}
            renderDay={this.renderDay.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            renderActions={this.renderCustomActions}
            renderCustomView={this.renderCustomView}
            user={{
              _id: this.state.user._id,
              name: this.state.name,
              avatar: this.state.user.avatar,
            }}
          />
          { Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  giftedChat: {
    flex: 1,
    width: "88%",
    paddingBottom: 10,
    justifyContent: "center",
    borderRadius: 5,
  },
});
*/