import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { styles, Colors, journalStyle } from '../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import {translate} from "../App";
import ContextMenuView from '../components/ContextMenuView';

export default class EventsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: 'Recurring Events',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => params.addEvent()} activeOpacity={0.8}>
          <Text style={[styles.headerButtonText, {color: Colors.Normal}]}>{translate("Add")}</Text>
        </TouchableOpacity>
      ),
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
    this.props.navigation.setParams({
      addEvent: this.addEvent.bind(this),
    });

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

  addEvent = () => {
    this.props.navigation.navigate("EditEvent", {});
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
      options={[
        {
          title: translate("Edit"),
        },
        {
          title: translate("Remove"),
          destructive: true,
        },
      ]}
      onPress={index => {
        if(index == 0) {
          this.props.navigation.navigate("EditEvent", {eventRef: PursuitOfHappiness.Database.dailyEventsRef.child(id)});
        } else if(index == 1) {
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
    options={[
      {
        title: translate("Edit"),
      },
      {
        title: translate("Remove"),
        destructive: true,
      },
    ]}
    onPress={index => {
      if(index == 0) {
        this.props.navigation.navigate("EditEvent", {eventRef: PursuitOfHappiness.Database.weeklyEventsRef.child(id)});
      } else if(index == 1) {
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