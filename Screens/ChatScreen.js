import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView } from 'react-native';
//Importation module react-native-elements
import { Button, Input, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
//Import du module client SocketIo
import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://192.168.1.16:3000");

export default function ChatScreen() {

  const [ currentMessage, setCurrentMessage ] = useState('');
  const [ listMessage, setListMessage ] = useState([]);

  useEffect(() => { 
    
    socket.on('sendMessageToAll', (newMessage)=> {
      setListMessage([...listMessage, newMessage]);
    });
    
  }, [listMessage]); 

  console.log(listMessage)

  let messageItem = listMessage.map((message, i) => {
    return <ListItem title={message} />
  });

  console.log(messageItem)
  
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
               onPress={() => {socket.emit('sendMessage', currentMessage);
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