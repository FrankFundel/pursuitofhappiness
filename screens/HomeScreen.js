import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles, Colors, Fonts } from '../styles';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;
    return {
      title: 'Home',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("Account")} activeOpacity={0.8}>
          
        </TouchableOpacity>
      ),
    }
  };

  render() {
    return <ScrollView style={styles.mainContainer}>
      
    </ScrollView>
  }
}