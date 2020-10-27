import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles, Colors, Fonts } from '../styles';
import CachedImage from '../components/CachedImage';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;
    return {
      title: 'Home',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => params.uid && navigation.navigate("Account", {uid: params.uid})} activeOpacity={0.8}>
          <CachedImage style={chatStyles.headerButtonImage} image={params.image} defaultSource={require("../assets/user.png")} />
        </TouchableOpacity>
      ),
    }
  };

  render() {
    return <ScrollView style={styles.mainContainer}>
      
    </ScrollView>
  }
}