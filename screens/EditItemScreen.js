import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput, ScrollView, Switch } from 'react-native';
import { Colors, Fonts, journalStyle, startStyles, styles } from '../styles';
import {translate} from "../App";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LottieView from 'lottie-react-native';

export default class EditItemScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: params.title,
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
      time: new Date(Date.now()),
      done: false,

      hasTime: false,
    };
  }

  componentDidMount() {
    this.params.itemRef.once("value", snapshot => {
      const {text, time, done} = snapshot.val();
      this.initDone = done;
      this.setState({text, time: time ? moment(time, "HH:mm").toDate() : new Date(), done, hasTime: time ? true : false});

      this.props.navigation.setParams({
        handleSave: this.handleSave.bind(this),
        title: text,
      });
    });
  }

  handleSave = () => {
    const {text, time, done, hasTime} = this.state;
    this.params.itemRef.update({text, time: hasTime ? moment(time).format("HH:mm") : null, done});
  }

  onChange = (event, date) => {
    if(date != undefined) {
      this.setState({time: date});
    }
  }

  toggleDone = () => {
    if(!this.state.done) {
      this.dropdown.play(24, 100);
      this.setState({done: true});
    } else {
      this.dropdown.reset();
      this.setState({done: false});
    }
  }

  render() {
    const {text, time, hasTime} = this.state;
    
    return (
      <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContainer}
      style={{backgroundColor: Colors.White}}>
        
        <View style={{paddingHorizontal: 16}}>
          <View style={{flexDirection: "row", alignItems: "center", marginTop: 16}}>
            <TouchableOpacity style={{width: 42, height: 42, justifyContent: "center"}} onPress={this.toggleDone}>
              <LottieView
                ref={animation => {
                  this.dropdown = animation;
                }}
                source={require('../assets/lottie/checkbox.json')}
                loop={false}
                progress={this.initDone ? 1 : 0}
                style={{width: 28, height: 28}}
              />
            </TouchableOpacity>

            <TextInput
              style={[styles.textInput, {borderColor: text ? Colors.Active : Colors.LightGray, marginTop: 0, flex: 1}]}
              placeholder={translate("What do you want to do?")}
              placeholderTextColor={Colors.LightGray}
              onChangeText={text => this.setState({ text })}
              value={text}
            />
          </View>
        </View>

        <View style={{margin: 16, marginTop: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <Text style={[styles.headline, {marginLeft: 0}]}>{translate("When")}</Text>
          <Switch
            trackColor={{ false: Colors.ExtraDarkGray, true: Colors.Normal }}
            thumbColor={Colors.White}
            ios_backgroundColor={Colors.ExtraDarkGray}
            onValueChange={hasTime => this.setState({ hasTime })}
            value={hasTime}
          />
        </View>

        <DateTimePicker
          style={{opacity: hasTime ? 1 : 0.3}}
          value={time}
          mode={"time"}
          is24Hour={true}
          display="default"
          onChange={this.onChange}
          disable
        />
      </ScrollView>
    )
  }
}

const settingsStyles = StyleSheet.create({
  settingTitle: {
    color: Colors.Black,
    fontSize: 15,
    ...Fonts.medium,
    letterSpacing: -0.41,
  },
  imageButton: {
    height: 164,
    width: "100%",
    borderRadius: 12,
    alignSelf: "center",
  },
  image: {
    height: 164,
    width: "100%",
    borderRadius: 12,
  },
  inputText: {
    ...Fonts.regular,
    lineHeight: 19,
    fontSize: 17,
    letterSpacing: -0.27,
  }
})