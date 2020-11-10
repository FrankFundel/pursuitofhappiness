import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles, Colors, Fonts, journalStyle } from '../styles';
import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import Accordion from 'react-native-collapsible/Accordion';
import Section from '../components/Section';
import {translate} from "../App";
import moment from 'moment';
import LottieView from 'lottie-react-native';
import ContextMenuView from '../components/ContextMenuView';

const CW = moment().isoWeek();

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
      PursuitOfHappiness.Database.journalRef.child(id).push(text);
    }
  }
  
  removeContent = (id, item) => {
    PursuitOfHappiness.Database.journalRef.child(id).child(item).remove();
  }

  renderHeader = (id, index, isActive) => {
    var title;
    var week = id.replace("-", "");
    if(week == CW) {
      title = translate("This Week");
    } else {
      title = translate("CW") + " " + week;
    }
    return <Section title={title} isActive={isActive} />;
  }

  renderContent = (id, item) => {
    const text = this.weeks[id][item];
    
    if(text) {
      return <ContextMenuView
      key={item}
      options={[
        {
          title: translate("Remove"),
          destructive: true,
        },
      ]}
      onPress={index => {
        if(index == 0) {
          this.removeContent(id, index);
        }
      }}>
        <View style={journalStyle.content}>
          <LottieView
            source={require('../assets/lottie/sun.json')}
            loop
            autoPlay
            style={{width: 16, height: 16, marginRight: 8}}
          />

          <Text style={[styles.text, {fontSize: 16, flex: 1}]}>{text}</Text>
        </View>
      </ContextMenuView>
    }
  }

  renderWeek = id => {
    const items = this.weeks[id];

    return (
      <View style={{margin: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}}>
        <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("I am grateful for")}</Text>

        {items && Object.keys(items).sort().map(item => this.renderContent(id, item))}
        
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
      this.weeks = snapshot.val() || [];
      if(!this.weeks["-" + CW]) this.weeks["-" + CW] = [];
      this.setState({weeks: Object.keys(this.weeks).sort().reverse()});
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