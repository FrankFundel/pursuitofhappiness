import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform, TextInput, ScrollView, Switch } from 'react-native';
import { Colors, Fonts, startStyles, styles } from '../styles';
import {translate} from "../App";
import DateTimePicker from '@react-native-community/datetimepicker';
import SegmentedControl from '@react-native-community/segmented-control';
import moment from 'moment';
import PursuitOfHappiness from '../modules/PursuitOfHappiness';

const SCHEDULES = {
  0: "daily",
  1: "weekly"
}

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
  
    this.allowedDays = {};
    WEEK_DAYS.forEach((d, i) => this.allowedDays[i] = true);

    this.state = {
      title: "",
      time: new Date(),
      scheduleIndex: 0,
      notify: false,

      allowedDays: {...this.allowedDays},
    };
  }

  componentDidMount() {
    if(this.params.eventRef) {
      this.params.eventRef.once("value", snapshot => {
        const {title, schedule, time, notify, allowedDays} = snapshot.val();
        this.setState({title, schedule, time: time ? moment(time, "HH:mm").toDate() : new Date(), notify, allowedDays});

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
    const {title, scheduleIndex, time, notify, allowedDays} = this.state;
    const schedule = SCHEDULES[scheduleIndex];
    const timeString = moment(time).format("HH:mm");
    var ref = this.params.eventRef;

    if(this.params.eventRef) {
      ref.update({title, time: timeString, notify, allowedDays: scheduleIndex == 0 ? allowedDays : null});
    } else {
      if(schedule == "daily") {
        ref = PursuitOfHappiness.Database.dailyEventsRef.push({title, time: timeString, schedule, notify, allowedDays});
      } else if(schedule == "weekly") {
        ref = PursuitOfHappiness.Database.weeklyEventsRef.push({title, time: timeString, schedule, notify});
      }
    }

    PursuitOfHappiness.Notifications.removeSchedule(ref.key);
    if(notify) {
      if(schedule == "daily") {
        Object.keys(allowedDays).forEach(d => {
          let daytime = moment(time).day(d);
          PursuitOfHappiness.Notifications.addSchedule(ref.key, title, daytime, "day");
        });
      } else if(schedule == "weekly") {
        PursuitOfHappiness.Notifications.addSchedule(ref.key, title, time, "week");
      }
    }
  }

  onChange = (event, date) => {
    if(date != undefined) {
      this.setState({time: date});
    }
  }

  renderDay = (day, index) => {
    const allowed = this.state.allowedDays && this.state.allowedDays[index];

    return (
      <TouchableOpacity style={{height: 32, marginTop: 8, backgroundColor: allowed ? "rgba(200,200,200,0.1)" : "rgba(200,200,200,0.3)", borderRadius: 9.5, alignItems: "center", justifyContent: "center", alignSelf: "flex-start", marginRight: 8}} activeOpacity={0.8} onPress={() => {
        var allowedDays = {...this.state.allowedDays};
        if(allowed) {
          delete allowedDays[index];
        } else {
          allowedDays[index] = true;
        }
        this.setState({allowedDays});
      }} key={index}>
        <Text style={[styles.text, {margin: 4, marginHorizontal: 8}]}>{translate(day)}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {title, scheduleIndex, time, notify, allowedDays} = this.state;
    
    var allowedDaysText = "";
    if(Object.keys(allowedDays).length == 0) {
      allowedDaysText = translate("Never");
    } else if(Object.keys(allowedDays).length == 7) {
      allowedDaysText = translate("Everyday");
    } else {
      allowedDaysText = translate("Every");
      Object.keys(allowedDays).forEach(id => {
        allowedDaysText += " " + translate(WEEK_DAYS[id]);
      });
    }

    return (
      <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContainer}
      style={{backgroundColor: Colors.White}}>
        
        <View style={{paddingHorizontal: 16}}>
          <Text style={[startStyles.infoText, {textAlign: "center", marginTop: 16}]}>{translate("Changes will apply in the following week")}</Text>

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
          
          {!this.params.eventRef && <View style={{marginTop: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
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
          </View>}
        </View>

        {scheduleIndex == 0 && <View style={{margin: 16}}>
          <Text style={settingsStyles.settingTitle}>{allowedDaysText}</Text>
          <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {WEEK_DAYS.map(this.renderDay)}
          </View>
        </View>}

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