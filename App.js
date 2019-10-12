import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import qs from 'qs';
import config from './config.js';

// OAuth function to handle the fitbit authentication URL.

function OAuth(client_id, cb) {
 Linking.addEventListener('url', handleUrl);
 function handleUrl(event) {
  Linking.removeEventListener('url', handleUrl);
  const [, query_string] = event.url.match(/\#(.*)/);
  const query = qs.parse(query_string);
  cb(query.access_token);
}
 
const oauthurl = `https://www.fitbit.com/oauth2/authorize?${qs.stringify({
 client_id,
 response_type: 'token',
 scope: 'heartrate activity activity profile sleep',
 redirect_uri:'fitbitTest1://fit', // it should be same as mentioned while registration at Fitbit.
 expires_in: '604800',
})}`;
console.log(oauthurl);
Linking.openURL(oauthurl).catch(err => console.error('Error processing linking', err));
}


function getData(access_token) {
  fetch('https://api.fitbit.com/1.2/user/-/sleep/date/2019-09-04.json', {
method: 'GET',
headers: {
 Authorization: `Bearer ${access_token}`,
},
// body: `root=auto&path=${Math.random()}`
})
.then(res => res.json())
.then(res => {
console.log(`res: ${JSON.stringify(res)}`);
})
.catch(err => {
  console.error('Error: ', err);
});
}
export default class App extends Component {
 
//You can either create a function to get authentication on a button click or just add it in componentDidMount to fire it on loading. 
//   goToFitbit() {
//     OAuth(config.client_id, getData);
//  } 
// This can be used as a TouchableOpacity function and would be fired when user initiates the function.
 
 
 componentDidMount() {
    OAuth(config.client_id, getData);
 }
 // function would be fired when user once the rendering is complete.
 
 render() {
  return (
  <View style={styles.container}>
    <Text style={styles.welcome}>
     Welcome to Fitbit Integration in React Native
    </Text>
     <Text>
     Note: Please check your console for values returned from the fitbit after successful redirect from the fitbit account website.
    </Text>
   
   // Custom function to initate authentication
   // Add this code only when you want it to be customised.
    <TouchableOpacity onPress={()=>this.goToFitbit()}>
     <Text>Go to Fitbit screen</Text>
     </TouchableOpacity>
  
  </View>
  );
 }
}


const styles = StyleSheet.create({
container: {
 flex: 1,
 justifyContent: 'center',
 alignItems: 'center',
 backgroundColor: '#00a8b5',
},
welcome: {
 fontSize: 16,
 textAlign: 'center',
 color: '#fff',
 margin: 10,
},
});
