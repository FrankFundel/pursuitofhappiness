import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { Colors, Fonts, journalStyle, startStyles, styles } from '../styles';
import {translate} from "../App";
import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2 // optional
    }
  ],
  legend: ["Rainy Days"] // optional
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
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
    };

    this.params = this.props.navigation.state.params;
  }

  componentDidMount = () => {
    
  }

  render() {
    const {events, startDate, progress} = this.state;

    return (
      <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContainer}
      style={{backgroundColor: Colors.White}}>
        
        <LineChart
          data={data}
          width={screenWidth}
          height={256}
          verticalLabelRotation={30}
          chartConfig={chartConfig}
          bezier
        />
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