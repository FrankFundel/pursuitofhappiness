import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles, chatStyles, Colors, Fonts } from '../styles';
import CachedImage from '../components/CachedImage';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const userimage = "";

    return {
      title: 'Home',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("Account")} activeOpacity={0.8}>
          <CachedImage style={chatStyles.headerButtonImage} image={userimage} defaultSource={require("../assets/user.png")} />
        </TouchableOpacity>
      ),
    }
  };

  render() {
    return <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}>
      
    </ScrollView>
  }
}