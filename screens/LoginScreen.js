import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import { styles, Colors, startStyles, Fonts } from '../styles';
import {translate} from "../App";

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      email: "",
      password: "",
      emailError: null,
      passwordError: null,
    };
  }

  handleLogin = () => {
    const { email, password } = this.state;
    
    this.setState({loading: true});
    auth().signInWithEmailAndPassword(email, password)
    .catch(error => {
      var emailError, passwordError;
      if(error.code == "auth/invalid-email") emailError = translate("This E-Mail is not valid")
      else if(error.code == "auth/user-disabled") emailError = translate("This user was disabled")
      else if(error.code == "auth/user-not-found") emailError = translate("This user does not exist")
      else if(error.code == "auth/wrong-password") passwordError = translate("Wrong password")
      this.setState({ emailError, passwordError, loading: false });
    });
  }

  render() {
    const {email, password, emailError, passwordError} = this.state;

    return (
      <KeyboardAwareScrollView style={styles.mainContainer} keyboardOpeningTime={0} scrollEnabled={false}>
        <View style={startStyles.contentContainer}>
          <Image source={require("../assets/iconAlpha.png")} style={startStyles.logo} />

          <Text style={startStyles.headline}>{translate("Welcome back")}</Text>
          <Text style={startStyles.subHeadline}>{translate("Sign in to your account")}</Text>

          <TextInput
            style={[styles.textInput, {borderWidth: 1, marginTop: 24, fontSize: 17, letterSpacing: -0.27,
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
            onSubmitEditing={this.handleLogin}
            value={this.state.password}
            placeholderTextColor={Colors.LightGray}
          />

          {passwordError && <Text style={startStyles.errorText}>{passwordError}</Text>}

          <TouchableOpacity style={[styles.button, {marginTop: 8, alignItems: "flex-start"}]} /*onPress={() => this.props.navigation.navigate("ForgotPassword")}*/ activeOpacity={0.8}>
            <Text style={startStyles.forgotText}>{translate("Forgot password?")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, {backgroundColor: email && password ? Colors.Active : Colors.ExtraLightGray, height: 50, marginTop: 16}]}
          disabled={!email || !password} onPress={this.handleLogin} activeOpacity={0.8}>
            {this.state.loading ? <ActivityIndicator animating={this.state.loading} color={Colors.White} /> : 
            <Text style={[styles.buttonText, {color: email && password ? Colors.White : Colors.LightGray, fontSize: 17, ...Fonts.semibold}]}>{translate("Continue")}</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, {marginTop: 16}]} onPress={() => this.props.navigation.navigate("Signup")} activeOpacity={0.8}>
            <Text style={[styles.buttonText, {color: Colors.LightGray, fontSize: 15, ...Fonts.semibold}]}>{translate("Don’t have an account yet? Sign up")}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}