  
import React, { useState, useEffect } from 'react';
import { AsyncStorage, Text, View, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import { connect } from 'react-redux';


function POIScreen(props) {

    const [ listPOI, setListPOI ] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem("POIList", (error, data) => {
            switch (data) {
                case (data) :
                    setListPOI(JSON.parse(data));
            }
        });
    }, []);

    const handleDelete = () => {

        AsyncStorage.removeItem("POIList");
        let copyListPOI = [...listPOI];
        copyListPOI = copyListPOI.filter((e) => {e.title !== POI.title});
        AsyncStorage.setItem("POIList", JSON.stringify(copyListPOI));
        setListPOI(copyListPOI);
    };

    return (
        <View>
            <Text style={{textAlign: 'center', marginTop: 50, marginBottom: 20, fontWeight: 'bold'}}>Your list of Points of Interest</Text>
            <ScrollView>
                {
                    listPOI.map((POI, i) => (
                        <ListItem 
                            key={i}
                            title={POI.title}
                            subtitle={POI.description}
                            rightIcon={
                                <Icon
                                    name='trash'
                                    size={24}
                                    color='#EA4E52'
                                    onPress={() => handleDelete()}
                                />
                            }
                            bottomDivider
                        />
                    ))
                }
            </ScrollView>
        </View>
    )
}

function mapStateToProps(state) {
    return { POIList: state.POIList }
};

function mapDispatchToProps(dispatch) {
    return {
        deletePOI: function(POITitle) {
            dispatch( {type: 'deletePOI', POITitle: POITitle} )
        }
    }
};

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(POIScreen);