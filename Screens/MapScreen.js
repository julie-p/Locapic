import React, { useState, useEffect } from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
//Composant pour la géoloc
import * as Location from 'expo-location';
//Composant pour déclencher la demande de permission
import * as Permissions from 'expo-permissions';
import { set } from 'react-native-reanimated';

//Import de redux
import {connect} from 'react-redux';

//Import du module client SocketIo
import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://192.168.1.16:3000");

function MapScreen(props) {

  const [ currentLatitude, setCurrentLatitude ] = useState(0);
  const [ currentLongitude, setCurrentLongitude ] = useState(0);
  const [ addPOI, setAddPOI ] = useState(false);
  const [ listPOI, setListPOI ] = useState([]);
  const [ isVisible, setIsVisible ] = useState(false);
  const [ titlePOI, setTitlePOI ] = useState('');
  const [ descriptionPOI, setDescriptionPOI ] = useState('');
  const [ tempPOI, setTempPOI ] = useState();
  const [ userListLocation, setUserListLocation ] = useState([]);

  useEffect(() => {

    //Récupération de la liste des POI :
    AsyncStorage.getItem('POIList', (error, data) => {
      switch (data) {
        case (data) :
          setListPOI(JSON.parse(data));
      }
    });

    async function askPermissions() {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        Location.watchPositionAsync({distanceInterval: 2}, 
          (location) => {
            setCurrentLatitude(location.coords.latitude);
            setCurrentLongitude(location.coords.longitude);
            socket.emit({pseudo: props.pseudo, latitude: location.coords.latitude, longitude: location.coords.long});
          });
      }
    };
    askPermissions();

  }, []);

  useEffect(() => {

    socket.on('sendUserLocationToAll', (newUser) => {
      let userListLocationCopy = [...userListLocation]; //Copie du contenu de userListLocation
      userListLocationCopy = userListLocation.filter(user => user.pseudo != newUser.pseudo); //Filtrage des pseudos, on récupère les pseudos différents du nôtre
      userListLocationCopy.push(newUser);//Push des new users dans la copie
      setUserListLocation(userListLocationCopy);//Màj de l'état avec la copie
    });

  }, [userListLocation]);//Enregistre l'info reçue dans un état

  const selectedPOI = (val) => {
    if (addPOI) {
      setAddPOI(false);
      setIsVisible(true);
      setTempPOI({latitude: val.nativeEvent.coordinate.latitude, longitude: val.nativeEvent.coordinate.longitude})
    }
  };

  //Enregistrement des POI :
  const handleSubmit = () => {
  
    let copyListPOI = [...listPOI, {latitude: tempPOI.latitude, longitude: tempPOI.longitude, title: titlePOI, description: descriptionPOI}]
    AsyncStorage.setItem("POIList", JSON.stringify(copyListPOI));
    setListPOI(copyListPOI);

    setIsVisible(false); 
  };

  const markerPOI = listPOI.map((POI, i) => {
    return <Marker key={i} pinColor='blue' coordinate={{latitude: POI.latitude, longitude: POI.longitude}} title={POI.title} description={POI.description} />
  });

  //Génération de marqueurs pour new users
  let newUserMarker = userListLocation.map((user, i) => {
    return <Marker key={i} pinColor='red' coordinate={{latitude: user.latitude, longitude: user.longitude}} title={user.pseudo} />
  });

  let disabled = false;
  switch (addPOI) {
    case true :
      disabled = true;
      break;
  };

    return (
        <View style={styles.container}>

          <Overlay
            isVisible={isVisible}
            onBackdropPress={() => {setIsVisible(false)}}
          >
              <View>
              <Input
                containerStyle={{width: 200, marginBottom: 30}}
                placeholder='Title'
                onChangeText={(e) => setTitlePOI(e)}
              />

              <Input
                containerStyle={{width: 200, marginBottom: 30}}
                placeholder='Description' 
                onChangeText={(e) => setDescriptionPOI(e)}
              />
      
              <Button
                title='Add POI' 
                onPress={() =>handleSubmit()}
              />
              </View>

          </Overlay>

          <MapView 
            onPress={(val) => {selectedPOI(val)}}
            style={{flex: 1}}
            initialRegion={{
              latitude: 48.866667,
              longitude: 2.333333,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >

          <Marker 
            coordinate={{latitude: currentLatitude, longitude: currentLongitude}}
            title = {props.pseudo}
            description = "You are here"
            pinColor='red'
          />

          {markerPOI}
          {newUserMarker}
          
          </MapView>

          <Button
            disabled={disabled}
            title=" Add Point of Interest" 
            icon={
              <Icon
              name="map-marker"
              size={20}
              color="#ffffff"
              />
            }
            buttonStyle={{backgroundColor: "#eb4d4b"}}
            type="solid"
            onPress={()=> setAddPOI(true)}
          /> 

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f2f2'
    }
  });

function mapStateToProps(state) {
  return {
    pseudo: state.pseudo, POIList: state.POIList
  }
};

function mapDispatchToProps(dispatch) {
  return {
    savePOI : function(POI) {
      dispatch( { type: 'savePOI', POI: POI} )
    }
  }
};
    
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapScreen);