import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView } from 'react-native';
//Importation module react-native-elements
import { Button, Input, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
//Import du module client SocketIo
import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://192.168.1.16:3000");

//Import de redux
import {connect} from 'react-redux';

function ChatScreen(props) {

  const [ currentMessage, setCurrentMessage ] = useState('');
  const [ listMessage, setListMessage ] = useState([]);

  useEffect(() => { 
    
    socket.on('sendMessageToAll', (newMessageData)=> {
      setListMessage([...listMessage, newMessageData]);
    });
    
  }, [listMessage]); 

  let messageItem = listMessage.map((messageData, i) => {

    //Mise en place des emojis :
    let msg = messageData.message.replace(/:\)/g, '\u263A');
    msg = msg.replace(/:\(/g, '\u2639');
    msg = msg.replace(/:\p/g, '\uD83D\uDE1B');
    msg = msg.replace(/<3/g, '\u2764');
    msg = msg.replace(/></g, '\uD83D\uDE11');
    msg = msg.replace(/:0/g, '\uD83D\uDE2E');
    msg = msg.replace(/:.\(/g, '\uD83D\uDE22');
    msg = msg.replace(/[a-z]*fuck[a-z]*/gi, '\u2022\u2022\u2022\u2022');
    msg = msg.replace(/[a-z]*salope[a-z]*/gi, '\u2022\u2022\u2022\u2022\u2022\u2022');
    msg = msg.replace(/[a-z]*pute[a-z]*/gi, '\u2022\u2022\u2022\u2022');
    msg = msg.replace(/[a-z]*bitch[a-z]*/gi, '\u2022\u2022\u2022\u2022\u2022');

    return <ListItem 
              key={i}
              title={msg}
              subtitle={messageData.pseudo} />
  });
  
    return (
      <View style={styles.container}>
        
       <ScrollView  style={styles.ScrollView}>
         
         {messageItem}

       </ScrollView >

       <KeyboardAvoidingView behavior="padding" enabled>
           <Input
               containerStyle = {styles.input}
               placeholder='Your message'
               onChangeText={(e) => setCurrentMessage(e)}
               value={currentMessage}
           />
           <Button
               icon={
                   <Icon
                   name="envelope-o"
                   size={20}
                   color="#ffffff"
                   />
               }
               title="Send"
               buttonStyle={styles.button}
               type="solid"
               onPress={() => {socket.emit('sendMessage', {message: currentMessage, pseudo:props.pseudo});
               setCurrentMessage('')}}
           />
       </KeyboardAvoidingView>
       
      </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f2f2'
    },
    ScrollView: {
      flex:1, 
      marginTop: 15
    },
    input: {
      marginBottom: 5
    }, 
    button: {
      backgroundColor: "#eb4d4b"
    }
  });


function mapStateToProps(state) {
  return {
    pseudo: state.pseudo
  }
};
  
export default connect(
  mapStateToProps,
  null
)(ChatScreen);
      