import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles, chatStyles, Colors, Fonts } from '../styles';
import CachedImage from '../components/CachedImage';
import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import {translate} from "../App";

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: 'Home',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("Account")} activeOpacity={0.8}>
          <CachedImage style={chatStyles.headerButtonImage} image={params.image} defaultSource={require("../assets/user.png")} />
        </TouchableOpacity>
      ),
    }
  };

  componentDidMount = () => {
    PursuitOfHappiness.Database.userRef.on("value", snapshot => {
      var {image, name, points, level} = snapshot.val();
      this.props.navigation.setParams({
        image,
      });
    });
  }

  render() {
    return <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}>
      
    </ScrollView>
  }
}