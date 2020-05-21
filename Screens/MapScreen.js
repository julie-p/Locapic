import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
//Composant pour la géoloc
import * as Location from 'expo-location';
//Composant pour déclencher la demande de permission
import * as Permissions from 'expo-permissions';

function MapScreen(props) {

  const [ currentLatitude, setCurrentLatitude ] = useState(0);
  const [ currentLongitude, setCurrentLongitude ] = useState(0);
  const [ addPOI, setAddPOI ] = useState(false);
  const [ listPOI, setListPOI ] = useState([]);
  const [ isVisible, setIsVisible ] = useState(false);
  const [ titlePOI, setTitlePOI ] = useState('');
  const [ descriptionPOI, setDescriptionPOI ] = useState('');
  const [ tempPOI, setTempPOI ] = useState();

  useEffect(() => {
    async function askPermissions() {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        Location.watchPositionAsync({distanceInterval: 2}, 
          (location) => {
            setCurrentLatitude(location.coords.latitude);
            setCurrentLongitude(location.coords.longitude);
          })
      }
    };
    askPermissions();
  }, []);

  const selectedPOI = (val) => {
    if (addPOI) {
      setAddPOI(false);
      setIsVisible(true);
      setTempPOI({latitude: val.nativeEvent.coordinate.latitude, longitude: val.nativeEvent.coordinate.longitude})
    }
  };

  const handleSubmit = () => {
    setIsVisible(false);
    setListPOI([...listPOI, {latitude: tempPOI.latitude, longitude: tempPOI.longitude, title: titlePOI, description: descriptionPOI}])
  };

  const markerPOI = listPOI.map((POI, i) => {
    return <Marker key={i} pinColor='blue' coordinate={{latitude: POI.latitude, longitude: POI.longitude}} title={POI.title} description={POI.description} />
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
            mapType = 'hybrid'
            initialRegion={{
              latitude: 48.866667,
              longitude: 2.333333,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              key={"currentPos"}
              coordinate={{latitude: currentLatitude, longitude: currentLongitude}}
              title= "Hello"
              description= "I am here"
              pinColor= 'red' 
            />

          {markerPOI}
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

export default MapScreen;