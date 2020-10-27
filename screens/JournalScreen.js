import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles, Colors, Fonts, startStyles } from '../styles';
import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import Accordion from 'react-native-collapsible/Accordion';
import ListItem from '../components/ListItem';
import {translate} from "../App";
import moment from 'moment';
import PeekAndPop from '@react-native-community/peek-and-pop';

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
      weeks: [],
      activeSections: [],
    };

    this.weeks = {};
  }

  addContent = (id, text) => {
    var week = this.weeks[id];
    if(!week.content) {
      PursuitOfHappiness.Database.journalRef.child(id).child("content").set([text]);
    } else {
      PursuitOfHappiness.Database.journalRef.child(id).child("content").child(week.content.length.toString()).set(text);
    }
    this.setState({text: ""});
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
    return <ListItem title={title} isActive={isActive} />;
  }

  renderContent = (id, text, index) => {
    return <PeekAndPop
      key={index}
      renderPreview={() =>
      <View style={[journalStyle.content, {flex: 1}]} key={index}>
        <Text style={[styles.text, {fontSize: 40}]}>{text}</Text>
      </View>}
      onPeek={() => console.log('onPeek')}
      onPop={() => console.log("onPop")}
      onDisappear={() => console.log('onDisappear')}
      previewActions={[
        {
          type: 'destructive',
          label: translate("Remove"),
          onPress: () => this.removeContent(id, index),
        },
      ]}>
        <View style={journalStyle.content} key={index}>
          <Text style={styles.text}>{text}</Text>
        </View>
    </PeekAndPop>
  }

  renderWeek = id => {
    const week = this.weeks[id];

    return (
      <View style={{margin: 16}}>
        <Text style={[styles.headline, {fontSize: 20, marginBottom: 12}]}>{translate("I am grateful for")}</Text>

        {week.content && week.content.map((text, index) => this.renderContent(id, text, index))}
        
        <TextInput
          style={[styles.textInput, {borderColor: this.state.text ? Colors.Active : Colors.LightGray}]}
          placeholder={translate("What made you happy?")}
          placeholderTextColor={Colors.LightGray}
          onChangeText={text => this.setState({ text })}
          onSubmitEditing={event => this.addContent(id, event.nativeEvent.text)}
          value={this.state.text}
          returnKeyType="done"
        />
      </View>
    );
  }

  componentDidMount = () => {
    PursuitOfHappiness.Database.journalRef.on("value", snapshot => {
      this.weeks = snapshot.val();
      this.setState({weeks: this.weeks ? Object.keys(this.weeks).reverse() : []}, () => {
        const weeks = this.state.weeks;
        if(!weeks || this.weeks[weeks[weeks.length-1]].cw != CW) {
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

const journalStyle = StyleSheet.create({
  content: {
    padding: 12, backgroundColor: Colors.WhiteGray, borderRadius: 10, marginBottom: 4
  }
});