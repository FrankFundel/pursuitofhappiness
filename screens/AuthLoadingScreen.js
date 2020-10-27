import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { styles, Colors, Fonts } from '../styles';
import SplashScreen from 'react-native-splash-screen';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

//import PushNotificationIOS from "@react-native-community/push-notification-ios";

export default class AuthLoadingScreen extends React.Component {

  componentDidMount = () => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 100);

    auth().onAuthStateChanged(async user => {
      if(user) {
        this.uid = user.uid;

        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerForRemoteNotifications();
        }
        await this.checkPermission();

        return this.props.navigation.navigate('Main');
      }
      return this.props.navigation.navigate('LoginStack');
    });
    
    messaging().onMessage(async message => {
      const {title, body, badge, type} = message.notification;
      const {uid} = message.data;
    });

    //messaging().onNotificationOpenedApp(this.openWithMessage);
    //messaging().getInitialNotification().then(this.openWithMessage);
  }
  
  async getToken() {
    var token = await AsyncStorage.getItem('@token');
    if (!token) {
      token = await messaging().getToken();
      if (token) {
        database().ref("users").child(this.uid).update({fcm_token: token});
        await AsyncStorage.setItem('@token', token);
      }
    }

    messaging().subscribeToTopic("all").then(response => {
      
    }).catch(err => {
      console.log(err);
    });
  }

  async checkPermission() {
    messaging().hasPermission()
    .then(enabled => {
      if (enabled == 1) {
        this.getToken();
      } else {
        this.requestPermission();
      }
    });
  }

  async requestPermission() {
    messaging().requestPermission()
    .then(() => {
      this.getToken();
    })
    .catch(error => {
      console.log('permission rejected');
    });
  }

  render() {
    return <View style={styles.mainContainer}>
      <ActivityIndicator style={{marginTop: '50%'}} />
    </View>
  }
}