import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput, ScrollView } from 'react-native';
import { Colors, Fonts, journalStyle, startStyles, styles } from '../styles';
import {translate} from "../App";
import DateTimePicker from '@react-native-community/datetimepicker';

export default class EditItemScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: params.title,
      largeTitle: false,
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => {
          params.handleSave();
          navigation.navigate("ToDo");
        }} activeOpacity={0.8}>
          <Text style={[styles.headerButtonText, {color: Colors.Normal}]}>{translate("Save")}</Text>
        </TouchableOpacity>
      ),
    }
  };
  
  constructor(props) {
    super(props);

    this.params = this.props.navigation.state.params;
  
    this.state = {
      text: "",
      time: "00:00",
      done: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleSave: this.handleSave.bind(this),
    });

    this.params.itemRef.once("value", snapshot => {
      const {text, time, done} = snapshot.val();
      this.setState({text, time, done});
    });
  }

  handleSave = () => {
    this.params.itemRef.update({});
  }

  onChange = (event, selectedDate) => {
    console.log(selectedDate);
  }

  render() {
    const {text, time, done} = this.state;
    
    return (
      <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContainer}
      style={{backgroundColor: Colors.White}}>
        
        <DateTimePicker
          value={time}
          mode={"time"}
          is24Hour={true}
          display="default"
          onChange={this.onChange}
        />
      </ScrollView>
    )
  }
}