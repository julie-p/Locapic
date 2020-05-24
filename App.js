console.disableYellowBox = true;

import React from 'react';
//Import des composants
import HomeScreen from './Screens/HomeScreen';
import MapScreen from './Screens/MapScreen';
import ChatScreen from './Screens/ChatScreen';
import POIScreen from './Screens/POIScreen'; 
//Import des modules de navigation & icônes
import {createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

//Import du reducer et création du store
import pseudo from './reducers/pseudo.reducer';
import POIList from './reducers/POI.reducer';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';

const store = createStore(combineReducers({pseudo, POIList}));

//Mise en place de la nav
//Menu bottom
const BottomNavigator = createBottomTabNavigator({
  Map: MapScreen,
  POI: POIScreen, 
  Chat: ChatScreen
 },
 {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      let iconName;
      switch (navigation.state.routeName) {
        case 'Map' :
            iconName = 'ios-navigate'; //Icône map
            break;
        case 'POI' :
            iconName = 'ios-bowtie'; //Icône POI 
        case 'Chat' :
            iconName = 'ios-chatboxes'; //Icône chat
            break;
      };

      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: '#eb4d4b', //couleur icône active
    inactiveTintColor: '#FFFFFF', //couleur icône inactive
    style: {
      backgroundColor: '#130f40', //couleur du menu
    }
  }
});
 
//Nav links
const StackNavigator = createStackNavigator(
   {
  Home: HomeScreen,  
  BottomNavigator: BottomNavigator
  },
  {
   headerMode: 'none' //Désactivation du menu du haut
  }
);

const Navigation = createAppContainer(StackNavigator); 

export default function App() {
  return(

    <Provider store={store}>

      <Navigation />


    </Provider>
  )
};