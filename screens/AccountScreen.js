import React from 'react';
import { StyleSheet, View } from 'react-native';
import { styles, Colors, Fonts } from '../styles';

export default class AccountScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: 'Account',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => params.handleSave()} activeOpacity={0.8}>
          <Text style={[styles.headerButtonText, {color: Colors.Active}]}>{translate("Save")}</Text>
        </TouchableOpacity>
      ),
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      name: translate("Username"),
      points: 0,
      level: 0,
  
      email: "",
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleSave: this.handleSave.bind(this),
    });

    this.userListener = SoundSquad.Database.userRef.on("value", snapshot => {
      var {image, name, points, level} = snapshot.val();
      this.setState({image, name, points, level});
    });

    const {email} = auth().currentUser;
    this.setState({email});
  }
  
  componentWillUnmount() {
    SoundSquad.Database.userRef.off("value", this.userListener);
  }

  handleSave = () => {
    const {name, image} = this.state;
    SoundSquad.Database.userRef.update({name, image});
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
						icon: <Icon name={"camera-outline"} size={24} family={"Ionicons"} color={Colors.White} />,
						titleTextAlignment: 0,
						titleTextColor: Colors.White,
					},
					{
						title: translate("Camera Roll"),
						icon: <Icon name={"image-outline"} size={24} family={"Ionicons"} color={Colors.White} />,
						titleTextAlignment: 0,
						titleTextColor: Colors.White,
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

  render() {
    return <View style={styles.mainContainer}>
      
    </View>
  }
}