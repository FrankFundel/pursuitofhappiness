import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput, ScrollView } from 'react-native';
import { Colors, Fonts, journalStyle, startStyles, styles } from '../styles';
import {translate} from "../App";
import CachedImage from '../components/CachedImage';
import LottieView from 'lottie-react-native';
import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import moment from 'moment';

const CW = moment().week();

export default class LectionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: params.title,
      largeTitle: false,
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("Home")} activeOpacity={0.8}>
          <Text style={[styles.headerButtonText, {color: Colors.Normal}]}>{translate("Done")}</Text>
        </TouchableOpacity>
      ),
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
      
    };

    this.params = this.props.navigation.state.params;
  }

  showStatistics = () => {
    this.props.navigation.navigate("Statistics", {id: this.params.id});
  }

  startLection = async () => {
    var eventIds = {};

    for(let event of this.params.events) {
      if(event.schedule == "daily") { // every day or specific day(s) per week
        const ref = PursuitOfHappiness.Database.dailyEventsRef.push(event);
        eventIds[ref.key] = true;

        for(let d = 0; d < 7; d++) {
          PursuitOfHappiness.Database.dailyTodoRef.child("-" + CW).child(d.toString()).push({
            done: false,
            text: event.title,
            time: event.time,
            progress: event.progress,
            eventId: ref.key,
            lectionId: this.params.id,
          });
        }
        
        if(event.notify) PursuitOfHappiness.Notifications.addSchedule(ref.key, event.title, event.time, "day");
      } else if(event.schedule == "weekly") { // sometimes every week
        const ref = PursuitOfHappiness.Database.weeklyEventsRef.push(event);
        eventIds[ref.key] = true;

        PursuitOfHappiness.Database.weeklyTodoRef.child("-" + CW).push({
          done: false,
          text: event.title,
          time: event.time,
          progress: event.progress,
          eventId: ref.key,
          lectionId: this.params.id,
        });
        
        if(event.notify) PursuitOfHappiness.Notifications.addSchedule(ref.key, event.title, event.time, "week");
      }
    }
    
    PursuitOfHappiness.Database.lectionDataRef.child(this.params.id).set({startDate: Date.now(), progress: 5, events: eventIds});

    this.props.navigation.navigate("Home");
  }

  renderItem = (text, index) => {
    return (
      <View style={journalStyle.content} key={index}>
        <LottieView
          source={require('../assets/lottie/sun.json')}
          loop
          autoPlay
          style={{width: 16, height: 16, marginRight: 8}}
        />

        <Text style={[styles.text, {fontSize: 16, flex: 1}]}>{text}</Text>
      </View>
    )
  }
  
  renderEvent = (event, index) => {
    const {title, date, schedule, time, notify} = event;

    return (
      <View style={journalStyle.content} key={index}>
        <Image source={require('../assets/clock.png')} style={{width: 16, height: 16, marginRight: 8}} />

        <Text style={[styles.text, {fontSize: 16, flex: 1}]}>{title}</Text>
        
        <Text style={[styles.text, {fontSize: 16, flex: 1, color: Colors.Active, textAlign: "center"}]}>{schedule || date}</Text>

        <View style={{flexDirection: "row", justifyContent: "flex-end", flex: 1}}>
          <Text style={[styles.text, {fontSize: 16, color: Colors.Active}]}>{time}</Text>
          <Text style={[styles.text, {fontSize: 16, color: Colors.Destructive, marginLeft: 4, opacity: notify ? 1 : 0}]}>!</Text>
        </View>
      </View>
    )
  }

  renderContent = (item, index) => {
    const {title, description, items} = item;

    return (
      <View style={{marginBottom: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}} key={index}>
        <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{title}</Text>
        
        <Text style={[lectionStyle.text, {marginHorizontal: 12, marginBottom: 12}]}>{description}</Text>
        
        {items && items.map(this.renderItem)}
      </View>
    )
  }

  render() {
    const {title, description, image, content, events, data} = this.params;
    const started = data ? true : false;

    return (
      <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContainer}
      style={{backgroundColor: Colors.White}}>
        
        <CachedImage style={{height: 200}} image={image} defaultSource={require("../assets/user.png")} />

        <View style={{margin: 16}}>
          <Text style={[startStyles.headline, {marginLeft: 0, marginTop: 12, width: "50%"}]} numberOfLines={2}>{title}</Text>

          <Text style={[lectionStyle.text, {marginTop: 12, marginBottom: 24}]}>{description}</Text>

          {content && content.map(this.renderContent)}
        </View>

        <View style={{margin: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}}>
          <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("Recurring Events")}</Text>

          {events && events.map(this.renderEvent)}
        </View>

        <TouchableOpacity style={[styles.button, {backgroundColor: Colors.Active, height: 50, marginTop: 24, marginHorizontal: 16}]} onPress={started ? this.showStatistics : this.startLection} activeOpacity={0.8}>
          <Text style={[styles.buttonText, {color: Colors.White, fontSize: 17, ...Fonts.semibold}]}>{translate(started ? "Show statistics" : "Start")}</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const lectionStyle = StyleSheet.create({
  text: {
    color: Colors.Black,
    ...Fonts.regular,
    fontSize: 16,
  }
});