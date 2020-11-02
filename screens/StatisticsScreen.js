import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Colors, Fonts, journalStyle, playerStyles, startStyles, styles } from '../styles';
import {translate} from "../App";
import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import { LineChart } from "react-native-chart-kit";
import moment from 'moment';

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: Colors.White,
  backgroundGradientTo: Colors.White,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

export default class StatisticsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: "Statistics",
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      startDate: 0,
      progress: 0,
      
      selectedEvent: null,
    };

    this.params = this.props.navigation.state.params;
    
    this.events = {};
    this.eventData = {};
  }

  componentDidMount = async () => {
    const dailyEvents = await PursuitOfHappiness.Database.dailyEventsRef.once("value");
    dailyEvents.forEach(snap => this.events[snap.key] = snap.val());
    const weeklyEvents = await PursuitOfHappiness.Database.weeklyEventsRef.once("value");
    weeklyEvents.forEach(snap => this.events[snap.key] = snap.val());

    PursuitOfHappiness.Database.lectionDataRef.child(this.params.id).once("value", async snapshot => {
      const {events, startDate, progress} = snapshot.val();
      const eventKeys = Object.keys(events);

      for(let key of eventKeys) {
        let data = (await PursuitOfHappiness.Database.eventDataRef.child(key).once("value")).val() || {};
        this.eventData[key] = this.dataToDataset(Object.values(data));
      }

      this.setState({events: eventKeys, startDate, progress, selectedEvent: eventKeys[0]});
    });
  }

  dataToDataset = data => {
    var hist = {};
    for(let point of data) {
      let cw = moment(point.date).week();
      if(hist[cw]) {
        hist[cw]++;
      } else {
        hist[cw] = 1;
      }
    }

    var labels = [];
    for(let cw in hist) {
      labels.push(translate("CW") + " " + cw);
    }

    return {
      labels,
      datasets: [
        {
          data: Object.values(hist),
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 3
        }
      ]
    };
  }

  renderEvent = id => {
    const {title} = this.events[id];
    const selected = this.state.selectedEvent == id;

    return (
      <TouchableOpacity style={{height: 32, marginTop: 8, backgroundColor: selected ? "rgba(100,100,100,0.3)" : "rgba(100,100,100,0.1)", borderRadius: 9.5, alignItems: "center", justifyContent: "center", alignSelf: "flex-start", marginRight: 8}} activeOpacity={0.8} onPress={() => {
        this.setState({selectedEvent: id});
      }} key={id}>
        <Text style={[playerStyles.connectText, {color: Colors.Black}]}>{title}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {events, startDate, progress, selectedEvent} = this.state;

    return (
      <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContainer}
      style={{backgroundColor: Colors.White}}>
        
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 12}}>
          <Text style={settingsStyles.settingTitle}>{translate("Started at")}</Text>
          <Text style={styles.text}>{moment(startDate).format("DD.MM.YYYY")}</Text>
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 12}}>
          <Text style={settingsStyles.settingTitle}>{translate("Progress")}</Text>
          <Text style={styles.text}>{progress + "%"}</Text>
        </View>

        <View style={{flexDirection: "row", flexWrap: "wrap", margin: 12}}>
          {events.map(this.renderEvent)}
        </View>

        {this.eventData[selectedEvent] && <LineChart
          data={this.eventData[selectedEvent]}
          width={screenWidth}
          height={256}
          verticalLabelRotation={30}
          chartConfig={chartConfig}
          bezier
        />}
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