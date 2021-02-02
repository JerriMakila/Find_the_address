import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Text } from 'react-native';
import Mapview, {Marker} from 'react-native-maps';

export default function App() {
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  
  const [coordinates, setCoordinates] = useState({
    longitude: 24.9341868,
    latitude: 60.2016812,
    title: 'Haaga-Helian ammattikorkeakoulu'
  });

  const fetchData = async () => {
    const addressString = address.toLowerCase().replace(" ", "+");

    try{
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressString}&key=`);
      const data = await response.json();

      if(data.results.length > 0){
        setCoordinates({
          longitude: data.results[0].geometry.location.lng,
          latitude: data.results[0].geometry.location.lat,
          title: data.results[0].formatted_address
        });

        setMessage('');
      } else {
        setMessage('The address was not found');
      }
    } catch(error){
      Alert.alert('Something went wrong, try again');
    }
  }

  return (
    <View style={styles.container}>
      <Mapview
        style={styles.mapView}
        region={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221
        }}>
        <Marker
          coordinate={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          }}
          title={coordinates.title} />
      </Mapview>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={address}
          onChangeText={address => setAddress(address)} />
        <Button onPress={fetchData} title='SHOW' />
        <View><Text style={{fontSize: 25}}>{message}</Text></View>
      </View>
      <StatusBar hidden={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
    paddingBottom: 10
  },

  mapView: {
    flex: 5,
    height: '100%',
    width: '100%'
  },

  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 25,
    height: 35,
    paddingHorizontal:5,
    width: 250,
  }
});
