import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput } from 'react-native';
import { styles, actionStyles, Colors, profileStyles, Fonts, journalStyle } from '../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ContextMenuView } from "react-native-ios-context-menu";

import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import {translate} from "../App";

export default class EventsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: 'Events',
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
      dailyEvents: [],
      weeklyEvents: [],
    };

    this.dailyEvents = {};
    this.weeklyEvents = {};
  }

  componentDidMount() {
    this.dailyEventsListener = PursuitOfHappiness.Database.dailyEventsRef.on("value", snapshot => {
      this.dailyEvents = snapshot.val() || {};
      this.setState({dailyEvents: Object.keys(this.dailyEvents)});
    });
    
    this.weeklyEventsListener = PursuitOfHappiness.Database.weeklyEventsRef.on("value", snapshot => {
      this.weeklyEvents = snapshot.val() || {};
      this.setState({weeklyEvents: Object.keys(this.weeklyEvents)});
    });
  }
  
  componentWillUnmount() {
    PursuitOfHappiness.Database.dailyEventsRef.off("value", this.dailyEventsListener);
    PursuitOfHappiness.Database.weeklyEventsRef.off("value", this.weeklyEventsListener);
  }

  removeDailyEvent = id => {
    PursuitOfHappiness.Database.dailyEventsRef.child(id).remove();
    PursuitOfHappiness.Notifications.removeSchedule(id);
  }
  
  removeWeeklyEvent = id => {
    PursuitOfHappiness.Database.weeklyEventsRef.child(id).remove();
    PursuitOfHappiness.Notifications.removeSchedule(id);
  }

  renderDailyEvent = (id, index) => {
    const {title, date, schedule, time, notify} = this.dailyEvents[id];

    return <ContextMenuView
      key={id}
      menuConfig={{
        menuTitle: '',
        menuItems: [
          {
            actionKey: "0",
            actionTitle: translate("Remove"),
            menuAttributes: ["destructive"],
          },
        ]
      }}
      onPressMenuItem={({nativeEvent}) => {
        var key = nativeEvent.actionKey;
        if(key == "0") {
          this.removeDailyEvent(id);
        }
      }}>
      <View style={journalStyle.content} key={index}>
        <Image source={require('../assets/clock.png')} style={{width: 16, height: 16, marginRight: 8}} />

        <Text style={[styles.text, {fontSize: 16, flex: 1}]}>{title}</Text>
        
        <Text style={[styles.text, {fontSize: 16, flex: 1, color: Colors.Active, textAlign: "center"}]}>{schedule || date}</Text>

        <View style={{flexDirection: "row", justifyContent: "flex-end", flex: 1}}>
          <Text style={[styles.text, {fontSize: 16, color: Colors.Active}]}>{time}</Text>
          <Text style={[styles.text, {fontSize: 16, color: Colors.Destructive, marginLeft: 4, opacity: notify ? 1 : 0}]}>!</Text>
        </View>
      </View>
    </ContextMenuView>
  }

  renderWeeklyEvent = (id, index) => {
    const {title, date, schedule, time, notify} = this.weeklyEvents[id];

    return <ContextMenuView
    key={id}
    menuConfig={{
      menuTitle: '',
      menuItems: [
        {
          actionKey: "0",
          actionTitle: translate("Remove"),
          menuAttributes: ["destructive"],
        },
      ]
    }}
    onPressMenuItem={({nativeEvent}) => {
      var key = nativeEvent.actionKey;
      if(key == "0") {
        this.removeWeeklyEvent(id);
      }
    }}>
      <View style={journalStyle.content} key={index}>
        <Image source={require('../assets/clock.png')} style={{width: 16, height: 16, marginRight: 8}} />

        <Text style={[styles.text, {fontSize: 16, flex: 1}]}>{title}</Text>
        
        <Text style={[styles.text, {fontSize: 16, flex: 1, color: Colors.Active, textAlign: "center"}]}>{schedule || date}</Text>

        <View style={{flexDirection: "row", justifyContent: "flex-end", flex: 1}}>
          <Text style={[styles.text, {fontSize: 16, color: Colors.Active}]}>{time}</Text>
          <Text style={[styles.text, {fontSize: 16, color: Colors.Destructive, marginLeft: 4, opacity: notify ? 1 : 0}]}>!</Text>
        </View>
      </View>
    </ContextMenuView>
  }

  render() {
    const {dailyEvents, weeklyEvents} = this.state;

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">

        <View style={{margin: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}}>
          <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("Daily")}</Text>

          {dailyEvents.map(this.renderDailyEvent)}
        </View>

        <View style={{margin: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}}>
          <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("Weekly")}</Text>

          {weeklyEvents.map(this.renderWeeklyEvent)}
        </View>
      </KeyboardAwareScrollView>
    )
  }
}