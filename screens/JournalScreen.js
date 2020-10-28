import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles, Colors, Fonts, journalStyle } from '../styles';
import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import Accordion from 'react-native-collapsible/Accordion';
import Section from '../components/Section';
import {translate} from "../App";
import moment from 'moment';
import PeekAndPop from '@react-native-community/peek-and-pop';
import LottieView from 'lottie-react-native';

const CW = moment().week();

export default class JournalScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: 'Journal',
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      textHeight: 48,
      weeks: [],
      activeSections: [0],
    };

    this.weeks = {};
  }

  addContent = (id, text) => {
    if(text) {
      var week = this.weeks[id];
      if(!week.content) {
        PursuitOfHappiness.Database.journalRef.child(id).child("content").set([text]);
      } else {
        PursuitOfHappiness.Database.journalRef.child(id).child("content").child(week.content.length.toString()).set(text);
      }
    }
  }
  
  removeContent = (id, index) => {
    PursuitOfHappiness.Database.journalRef.child(id).child("content").child(index.toString()).remove();
  }

  renderHeader = (id, index, isActive) => {
    const week = this.weeks[id];
    var title;
    if(week.cw == moment().week()) {
      title = translate("This Week");
    } else {
      title = translate("CW") + " " + week.cw;
    }
    return <Section title={title} isActive={isActive} />;
  }

  renderContent = (id, text, index) => {
    if(text) {
      return <PeekAndPop
        key={index}
        renderPreview={() =>
        <View style={journalStyle.contentPeek} key={index}>
          <LottieView
            source={require('../assets/lottie/sun.json')}
            loop
            autoPlay
            style={{width: 24, height: 24, marginRight: 8}}
          />

          <Text style={[styles.text, {fontSize: 16, flex: 1}]}>{text}</Text>
        </View>}
        onPeek={() => PursuitOfHappiness.blurApp(true)}
        onDisappear={() => PursuitOfHappiness.blurApp(false)}
        previewActions={[
          {
            type: 'destructive',
            label: translate("Remove"),
            onPress: () => this.removeContent(id, index),
          },
        ]}>
          <View style={journalStyle.content} key={index}>
            <LottieView
              source={require('../assets/lottie/sun.json')}
              loop
              autoPlay
              style={{width: 16, height: 16, marginRight: 8}}
            />

            <Text style={[styles.text, {fontSize: 16, flex: 1}]}>{text}</Text>
          </View>
      </PeekAndPop>
    }
  }

  renderWeek = id => {
    const week = this.weeks[id];

    return (
      <View style={{margin: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}}>
        <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("I am grateful for")}</Text>

        {week.content && week.content.map((text, index) => this.renderContent(id, text, index))}
        
        <TextInput
          style={[journalStyle.textInput, {height: this.state.textHeight > 90 ? 90 : this.state.textHeight}]}
          placeholder={translate("What made you happy?")}
          placeholderTextColor={Colors.LightGray}
          onSubmitEditing={event => this.addContent(id, event.nativeEvent.text)}
          value={this.state.text}
          returnKeyType="done"
          blurOnSubmit={false}
          multiline
          onContentSizeChange={event => this.setState({ textHeight: event.nativeEvent.contentSize.height + 28 })}
          onKeyPress={({nativeEvent}) => this.setState({text: nativeEvent.key === 'Enter' ? "" : nativeEvent.text})}
        />
      </View>
    );
  }

  componentDidMount = () => {
    PursuitOfHappiness.Database.journalRef.on("value", snapshot => {
      this.weeks = snapshot.val();
      this.setState({weeks: this.weeks ? Object.keys(this.weeks).reverse() : []}, () => {
        const weeks = this.state.weeks;
        if(weeks.length == 0 || this.weeks[weeks[weeks.length-1]].cw != CW) {
          PursuitOfHappiness.Database.journalRef.push({
            cw: CW,
          });
        }
      });
    });
  }

  render() {
    return <KeyboardAwareScrollView keyboardOpeningTime={0}
    keyboardShouldPersistTaps='handled'
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={styles.scrollContainer}
    showsVerticalScrollIndicator={false}>
      <Accordion
        sections={this.state.weeks}
        activeSections={this.state.activeSections}
        renderHeader={this.renderHeader}
        renderContent={this.renderWeek}
        onChange={activeSections => this.setState({ activeSections })}
        underlayColor={Colors.WhiteGray}
      />
    </KeyboardAwareScrollView>
  }
}