import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput, ScrollView } from 'react-native';
import { Colors, Fonts, journalStyle, startStyles, styles } from '../styles';
import {translate} from "../App";
import CachedImage from '../components/CachedImage';
import LottieView from 'lottie-react-native';
import database from '@react-native-firebase/database';

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

  startLection = () => {

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
    const {title, date, schedule, time} = event;

    return (
      <View style={journalStyle.content} key={index}>
        <Image source={require('../assets/clock.png')} style={{width: 16, height: 16, marginRight: 8}} />

        <Text style={[styles.text, {fontSize: 16, flex: 1}]}>{title}</Text>
        
        <Text style={[styles.text, {fontSize: 16, flex: 1, color: Colors.Active, textAlign: "center"}]}>{schedule || date}</Text>

        <Text style={[styles.text, {fontSize: 16, flex: 1, color: Colors.Active, textAlign: "right"}]}>{time}</Text>
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
    const {title, description, image, content, events} = this.params;

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
          <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("Events")}</Text>

          {events && events.map(this.renderEvent)}
        </View>

        <TouchableOpacity style={[styles.button, {backgroundColor: Colors.Active, height: 50, marginTop: 24, marginHorizontal: 16}]} onPress={this.startLection} activeOpacity={0.8}>
          <Text style={[styles.buttonText, {color: Colors.White, fontSize: 17, ...Fonts.semibold}]}>{translate("Start")}</Text>
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