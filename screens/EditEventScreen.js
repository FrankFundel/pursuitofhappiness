import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput, ScrollView, Switch } from 'react-native';
import { Colors, Fonts, journalStyle, startStyles, styles } from '../styles';
import {translate} from "../App";
import DateTimePicker from '@react-native-community/datetimepicker';
import SegmentedControl from '@react-native-community/segmented-control';
import moment from 'moment';

const SCHEDULES = {
  0: "daily",
  1: "weekly"
}

export default class EditEventScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: params.title,
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => {
          params.handleSave();
          navigation.navigate("Events");
        }} activeOpacity={0.8}>
          <Text style={[styles.headerButtonText, {color: Colors.Normal}]}>{translate(params.eventRef ? "Save" : "Add")}</Text>
        </TouchableOpacity>
      ),
    }
  };
  
  constructor(props) {
    super(props);

    this.params = this.props.navigation.state.params;
  
    this.state = {
      text: "",
      time: new Date(),
      done: false,
    };
  }

  componentDidMount() {
    if(this.params.eventRef) {
      this.params.eventRef.once("value", snapshot => {
        const {title, schedule, time, notify} = snapshot.val();
        this.setState({title, schedule, time: time ? moment(time, "HH:mm").toDate() : new Date(), notify});

        this.props.navigation.setParams({
          handleSave: this.handleSave.bind(this),
          title,
        });
      });
    } else {
      this.props.navigation.setParams({
        handleSave: this.handleSave.bind(this),
        title: translate("Add"),
      });
    }
  }

  handleSave = () => {
    const {title, scheduleIndex, time, notify} = this.state;
    const schedule = SCHEDULES[scheduleIndex];
    if(this.params.eventRef) {
      this.params.eventRef.update({title, time: moment(time).format("HH:mm"), schedule, notify});
    } else {
      this.params.eventRef.set({title, time: moment(time).format("HH:mm"), schedule, notify});
    }
  }

  onChange = (event, date) => {
    this.setState({time: date});
  }

  render() {
    const {title, scheduleIndex, time, notify} = this.state;
    
    return (
      <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContainer}
      style={{backgroundColor: Colors.White}}>
        
        <View style={{paddingHorizontal: 16}}>
          <TextInput
            style={[styles.textInput, {borderColor: title ? Colors.Active : Colors.LightGray}]}
            placeholder={translate("What do you want to do?")}
            placeholderTextColor={Colors.LightGray}
            onChangeText={title => this.setState({ title })}
            value={title}
          />
          
          <View style={{marginTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={settingsStyles.settingTitle}>{translate("Notify")}</Text>
            <Switch
              trackColor={{ false: Colors.ExtraDarkGray, true: Colors.Normal }}
              thumbColor={Colors.White}
              ios_backgroundColor={Colors.ExtraDarkGray}
              onValueChange={notify => this.setState({ notify })}
              value={notify}
            />
          </View>
          
          <View style={{marginTop: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={settingsStyles.settingTitle}>{translate("Schedule")}</Text>
            {Platform.select({
              android: 
              <SegmentedControl
                style={{width: 220}}
                backgroundColor={Colors.ExtraDarkGray}
                textColor={Colors.White}
                tintColor={Colors.DarkGray}
                values={[translate('Daily'), translate('Weekly')]}
                selectedIndex={scheduleIndex}
                onChange={event => {
                  this.setState({scheduleIndex: event.nativeEvent.selectedSegmentIndex});
                }}
              />,
              ios:
              <SegmentedControl
                style={{width: 220}}
                values={[translate('Daily'), translate('Weekly')]}
                selectedIndex={scheduleIndex}
                onChange={event => {
                  this.setState({scheduleIndex: event.nativeEvent.selectedSegmentIndex});
                }}
              />
            })}
          </View>
        </View>

        <Text style={[styles.headline, {marginTop: 24}]}>{translate("When")}</Text>
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