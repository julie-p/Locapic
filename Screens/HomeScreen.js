import React, { useState } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
//Importation module react-native-elements
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

//Import de redux
import {connect} from 'react-redux';

function HomeScreen({ navigation, submitPseudo }) {

  //Etat qui stocke la valeur du champ de saisie pour le pseudo
  const [ pseudo, setPseudo ] = useState('');

  return (
    /* Image de fond Homepage */
   <ImageBackground source={require('../assets/home.jpg')} style={styles.container}>
     {/* Champ de saisie pour le pseudo */}
     <Input
           containerStyle = {styles.inputContainer}
           inputStyle={styles.inputStyle}
           placeholder='Enter your pseudo'
           leftIcon={
               <Icon
               name='user'
               size={24}
               style={styles.icon}
               />
           }  
           onChangeText= {(val) => setPseudo(val)}
           />
      {/* Bouton submit redirige vers map */}
     <Button
        icon={
           <Icon
             name="arrow-right"
             size={20}
             style={styles.icon}
           />
         }

       title="Go to Map"
       type="solid"
       onPress={() => {submitPseudo(pseudo); navigation.navigate('Map')}}
     />

   </ImageBackground>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
 },
 inputContainer : {
    marginBottom: 25, 
    width: '70%'
 }, 
 inputStyle: {
  marginLeft: 10
 },
 icon: {
   color: "#eb4d4b"
 }
});


function mapDispatchToProps(dispatch) {
  return {
    submitPseudo: function(pseudo) {
      dispatch ( {type: 'savePseudo', pseudo: pseudo} )
    }
  }
};

export default connect(
  null, 
  mapDispatchToProps
)(HomeScreen);