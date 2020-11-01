import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles, chatStyles, Colors, Fonts, profileStyles } from '../styles';
import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import CachedImage from '../components/CachedImage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {translate} from "../App";

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: 'Home',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("Account")} activeOpacity={0.8}>
          <CachedImage style={chatStyles.headerButtonImage} image={params.image} defaultSource={require("../assets/user.png")} />
        </TouchableOpacity>
      ),
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      lections: [],
    }

    this.lections = {};
  }

  componentDidMount = () => {
    PursuitOfHappiness.Database.userRef.on("value", snapshot => {
      var {image, name, points, level} = snapshot.val();
      this.props.navigation.setParams({
        image,
      });
    });

    PursuitOfHappiness.Database.lectionsRef.child("en").on("value", snapshot => {
      snapshot.forEach(snap => this.lections[snap.key] = snap.val()); // for order
      this.setState({lections: Object.keys(this.lections)});
    });

    PursuitOfHappiness.Database.lectionDataRef.on("value", snapshot => {
      snapshot.forEach(snap => this.lections[snap.key].data = snap.val());
      this.setState({lections: Object.keys(this.lections)});
    });
  }

  renderLection = (id, index) => {
    const item = this.lections[id];
    const {title, image, data} = item;

    return (
      <View style={{alignItems: "center", marginTop: 32, width: index % 3 == 0 ? "100%" : "50%"}} key={index}>
        <AnimatedCircularProgress size={124} width={8} fill={data ? data.progress : 0} backgroundColor={Colors.ExtraLightGray} tintColor={Colors.Light} lineCap={"round"}>
          {(fill) => 
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Lection", {id, ...item})} activeOpacity={0.8}>
            <CachedImage style={profileStyles.userImage} image={image} defaultSource={require("../assets/user.png")} />
          </TouchableOpacity>}
        </AnimatedCircularProgress>

        <Text style={[styles.headlineCenter, {marginTop: 8}]}>{title}</Text>
      </View>
    )
  }

  render() {
    return <ScrollView
      keyboardShouldPersistTaps='handled'
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.scrollContainer, {flexDirection: "row", flexWrap: "wrap"}]}
      showsVerticalScrollIndicator={false}>
      
      {this.state.lections.map(this.renderLection)}
    </ScrollView>
  }
}