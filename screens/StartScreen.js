import React from 'react';
import { StyleSheet, View, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { styles, Colors, Fonts, startStyles } from '../styles';
import auth from '@react-native-firebase/auth';
import {translate} from "../App";

import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';

export default class StartScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
  
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }
  
    // Create a Firebase credential from the response
    const { identityToken, nonce, fullName } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  
    // Sign the user in with the credential
    auth().signInWithCredential(appleCredential)
    .then(userInfo => {
      userInfo.user.updateProfile({displayName: fullName.nickname});
    });
  }

  render() {
    return (
      <View style={styles.mainContainer} >
        <View style={startStyles.contentContainer}>
          <Image source={require("../assets/iconAlpha.png")} style={startStyles.logo} />

          <Text style={startStyles.headline}>{translate("Brighten Your Life")}</Text>

          <TouchableOpacity style={[styles.button, {backgroundColor: Colors.Active, height: 50, marginTop: 32}]} onPress={() => this.props.navigation.navigate("SignUp")} activeOpacity={0.8}>
            <Text style={[styles.buttonText, {color: Colors.White, fontSize: 17, ...Fonts.semibold}]}>{translate("Register")}</Text>
          </TouchableOpacity>

          {Platform.OS == "ios" &&
          <AppleButton
            style={{ width: "100%", height: 50, marginTop: 16 }}
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={this.onAppleButtonPress}
          />}
          
          <TouchableOpacity style={[styles.button, {marginTop: 8}]} onPress={() => this.props.navigation.navigate("Login")} activeOpacity={0.8}>
            <Text style={[styles.buttonText, {color: Colors.LightGray, fontSize: 15, ...Fonts.semibold}]}>{translate("Already have an account? Sign in")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}