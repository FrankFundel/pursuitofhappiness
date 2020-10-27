import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput } from 'react-native';
import { styles, actionStyles, Colors, profileStyles, Fonts } from '../styles';

import Icon from 'react-native-vector-icons';
import IconActionSheet from 'react-native-icon-action-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import CachedImage from '../components/CachedImage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {translate} from "../App";

const options = {
  width: 256,
  height: 256,
  cropping: true,
  cropperCircleOverlay: true,
};

export default class AccountScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: 'Account',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => params.handleSave()} activeOpacity={0.8}>
          <Text style={[styles.headerButtonText, {color: Colors.Normal}]}>{translate("Save")}</Text>
        </TouchableOpacity>
      ),
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      name: "",
      points: 0,
      level: 0,
  
      email: "",
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleSave: this.handleSave.bind(this),
    });

    this.userListener = PursuitOfHappiness.Database.userRef.on("value", snapshot => {
      var {image, name, points, level} = snapshot.val();
      this.setState({image, name, points, level});
    });

    const {email} = auth().currentUser;
    this.setState({email});
  }
  
  componentWillUnmount() {
    PursuitOfHappiness.Database.userRef.off("value", this.userListener);
  }

  handleSave = () => {
    const {name, image} = this.state;
    PursuitOfHappiness.Database.userRef.update({name, image});
    this.props.navigation.goBack();
  }

  handleImage = res => {
    this.setState({image: res.path}, () => {
      //Upload
      var ref = storage().ref("users").child(auth().currentUser.uid).child("userImage");
      var task = ref.putFile(res.path);
      task.then(async taskSnapshot => {
        if(taskSnapshot.state === "success") {
          const url = await ref.getDownloadURL();
          this.setState({image: url});
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
    });
  }

  showImageSheet = () => {
    IconActionSheet.showActionSheetWithOptions(
			{
				cancelButtonIndex: 3,
				tintColor: '#007aff',
				options: [
					{
						title: translate('Take a picture'),
						icon: <Icon name={"camera-outline"} size={24} family={"Ionicons"} color={Colors.Black} />,
						titleTextAlignment: 0,
						titleTextColor: Colors.Black,
					},
					{
						title: translate("Camera Roll"),
						icon: <Icon name={"image-outline"} size={24} family={"Ionicons"} color={Colors.Black} />,
						titleTextAlignment: 0,
						titleTextColor: Colors.Black,
					},
					{
						title: translate("Remove"),
						icon: <Icon name={"trash-outline"} size={24} family={"Ionicons"} color={Colors.Destructive} />,
						titleTextAlignment: 0,
						titleTextColor: Colors.Destructive,
					},
					{
						title: translate('Cancel')
					}
				]
			}, async index => {
        if(index == 0) {
          ImagePicker.openCamera(options).then(this.handleImage);
        } else if(index == 1) {
          ImagePicker.openPicker(options).then(this.handleImage);
        } else if(index == 2) {
          this.setState({image: null});
        }
      });
  }

  handleLogOut = async () => {
    auth().signOut()
    .then(() => {
      this.props.navigation.navigate('Start');
    })
    .catch(error => console.log(error))
  }

  render() {
    const {image, name, email, points, level} = this.state;

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">

        <View style={{flexDirection: "row", padding: 24}}>
          <AnimatedCircularProgress size={124} width={8} fill={points / (level+1)} backgroundColor={Colors.ExtraLightGray} tintColor={Colors.Normal} lineCap={"round"}>
            {
              (fill) => (
                <TouchableOpacity onPress={this.showImageSheet} activeOpacity={0.8}>
                  <CachedImage style={profileStyles.userImage} image={image} defaultSource={require("../assets/user.png")} />
                </TouchableOpacity>
              )
            }
          </AnimatedCircularProgress>
          
          <View style={{marginLeft: 24, marginTop: 12}}>
            <TextInput
              style={profileStyles.userName}
              placeholder={translate("Username")}
              placeholderTextColor={Colors.LightGray}
              onChangeText={name => this.setState({ name })}
              value={name}
              maxLength={14}
              multiline
            />
            <Text style={profileStyles.subTitle}>{translate("Level") + " " + level + " • " + points + " " + translate("Points")}</Text>
          </View>
        </View>

        <View style={{paddingHorizontal: 16}}>
          <TextInput
            style={[styles.textInput, {borderColor: name ? Colors.Active : Colors.LightGray}]}
            placeholder={translate("Username")}
            placeholderTextColor={Colors.LightGray}
            onChangeText={name => this.setState({ name })}
            value={name}
            maxLength={28}
          />

          <TextInput
            style={[styles.textInput, {borderColor: Colors.LightGray, marginBottom: 16}]}
            placeholder={translate("E-Mail")}
            placeholderTextColor={Colors.LightGray}
            onChangeText={email => this.setState({ email })}
            value={email}
            editable={false}
          />
          
          <TouchableOpacity style={styles.button} onPress={this.handleLogOut} activeOpacity={0.8}>
            <Text style={[styles.buttonText, {color: Colors.Destructive, fontSize: 17, ...Fonts.semibold}]}>{translate("Log Out")}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}