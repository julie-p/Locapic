import React from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView } from 'react-native';
//Importation module react-native-elements
import { Button, Input, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ChatScreen() {
    return (
      <View style={styles.container}>
        {/* Liste représentant les messages reçus */}
       <ScrollView  style={styles.ScrollView}>
         <ListItem title="Parfait et toi ?" subtitle="Alex"/>
         <ListItem title="Coucou ça roule ?" subtitle="John"/>
       </ScrollView >

       <KeyboardAvoidingView behavior="padding" enabled>
           <Input
               containerStyle = {styles.input}
               placeholder='Your message'
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