import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import { styles, Colors, startStyles, Fonts } from '../styles';
import {translate} from "../App";
import PursuitOfHappiness from '../modules/PursuitOfHappiness';

export default class SignUpScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      username: "",
      email: "",
      password: "",
      emailError: null,
      passwordError: null,
    };
  }

  waitForDBEntry = name => {
    setTimeout(async () => {
      let res = await PursuitOfHappiness.Database.userRef.once("value");
      if(res.exists()) {
        PursuitOfHappiness.Database.userRef.update({name});
      } else {
        this.waitForDBEntry(name);
      }
    }, 2000);
  }

  handleSignup = () => {
    const { email, password, username } = this.state;
    
    this.setState({loading: true});
    auth().createUserWithEmailAndPassword(email, password)
    .then(userInfo => {
      userInfo.user.updateProfile({displayName: username});
      this.waitForDBEntry(username);
    })
    .catch(error => {
      var emailError, passwordError;
      if(error.code == "auth/email-already-in-use") emailError = translate("An account with this E-Mail already exists")
      else if(error.code == "auth/invalid-email") emailError = translate("This E-Mail is not valid")
      else if(error.code == "auth/weak-password") passwordError = translate("This password is not strong enough")
      this.setState({ emailError, passwordError, loading: false });
    });
  }

  render() {
    const {username, email, password, emailError, passwordError} = this.state;

    return (
      <KeyboardAwareScrollView
        style={styles.mainContainer}
        keyboardOpeningTime={0} showsVerticalScrollIndicator={false}>
        <View style={startStyles.contentContainer}>
          <Image source={require("../assets/iconAlpha.png")} style={startStyles.logo} />

          <Text style={startStyles.headline}>{translate("Create Your Account")}</Text>
          <Text style={startStyles.subHeadline}>{translate("Sign up and get started")}</Text>

          <TextInput
            style={[styles.textInput, {borderWidth: 1, marginTop: 24, fontSize: 17, letterSpacing: -0.27,
              borderColor: username ? Colors.Active : Colors.LightGray}]}
            placeholder={translate("Username")}
            onChangeText={username => this.setState({ username })}
            autoCapitalize="none"
            value={username}
            placeholderTextColor={Colors.LightGray}
            maxLength={14}
          />

          <TextInput
            style={[styles.textInput, {borderWidth: 1, marginTop: 16, fontSize: 17, letterSpacing: -0.27,
              borderColor: emailError ? Colors.Destructive : (email ? Colors.Active : Colors.LightGray)}]}
            placeholder={translate("E-Mail")}
            onChangeText={email => this.setState({ email })}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            placeholderTextColor={Colors.LightGray}
          />
          
          {emailError && <Text style={startStyles.errorText}>{emailError}</Text>}

          <TextInput
            style={[styles.textInput, {borderWidth: 1, marginTop: 16, fontSize: 17, letterSpacing: -0.27,
              borderColor: passwordError ? Colors.Destructive : (password ? Colors.Active : Colors.LightGray)}]}
            placeholder={translate("Password")}
            onChangeText={password => this.setState({ password })}
            returnKeyType="done"
            secureTextEntry
            onSubmitEditing={this.handleSignup}
            value={this.state.password}
            placeholderTextColor={Colors.LightGray}
          />

          <Text style={[startStyles.errorText, passwordError && {marginBottom: 12}]}>{passwordError || ""}</Text>

          <Text style={startStyles.infoText}>
            {translate("Password regulations")}
          </Text>

          <TouchableOpacity style={[styles.button, {backgroundColor: username && email && password ? Colors.Active : Colors.ExtraLightGray, height: 50, marginTop: 24}]}
          disabled={!email || !password} onPress={this.handleSignup} activeOpacity={0.8}>
            {this.state.loading ? <ActivityIndicator animating={this.state.loading} color={Colors.White} /> : 
            <Text style={[styles.buttonText, {color: username && email && password ? Colors.White : Colors.LightGray, fontSize: 17, ...Fonts.semibold}]}>{translate("Create an account")}</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, {marginTop: 16}]} /*onPress={() => this.props.navigation.navigate("Signup")}*/ activeOpacity={0.8}>
            <Text style={[startStyles.infoText, {textAlign: "center"}]}>{translate("By signing up, you agree to our")} <Text style={{fontWeight: "bold"}}>{translate("Terms of Use")}</Text>{translate(" and \n")}<Text style={{fontWeight: "bold"}}>{translate("Privacy Policy")}</Text>.</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}