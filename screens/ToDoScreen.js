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
import { TabView, TabBar } from 'react-native-tab-view';
import ListItem from '../components/ListItem';

const CW = moment().week();
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default class ToDoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: 'ToDo',
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'weekly', title: translate('Weekly') },
        { key: 'daily', title: translate('Daily') },
        { key: 'overall', title: translate('Overall') },
      ],
      text: "",
      weeks: [],
      activeSections: [0],
      selectedDay: null,
    };

    this.weeks = {};
  }

  addItem = (id, day, text) => {
    var week = this.weeks[id];
    if(!week.days) {
      PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("days").set({[day]: [{
        done: false,
        text,
      }]});
    } else if(!week.days[day]) {
      PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("days").child(day.toString()).set([{
        done: false,
        text,
      }]);
    } else {
      PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("days").child(day.toString()).child(week.days[day].length.toString()).set({
        done: false,
        text,
      });
    }
    this.setState({text: ""});
  }
  
  removeDay = (id, day) => {
    PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("days").child(day.toString()).remove();
  }

  removeItem = (id, day, index) => {
    PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("days").child(day.toString()).child(index.toString()).remove();
  }
  
  setItemDone = (id, day, index, done) => {
    PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("days").child(day.toString()).child(index.toString()).update({done});
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

  renderItem = (id, day, index, item) => {
    const {done, text} = item;
    return <ListItem title={text} done={done} onPress={() => {
      this.setItemDone(id, day, index, !done);
    }} key={index} />;
  }

  renderDay = (id, content, day) => {
    var name = WEEK_DAYS[day];
    const {selectedDay} = this.state;

    return <PeekAndPop
      key={day}
      renderPreview={() =>
      <View style={[journalStyle.content, {flex: 1}]} key={day}>
        <Text style={[styles.headline, content && content.length > 0 && {marginBottom: 8}]}>{name}</Text>
        {content && content.map((item, index) => this.renderItem(id, day, index, item))}
      </View>}
      onPeek={() => console.log('onPeek')}
      onPop={() => console.log("onPop")}
      onDisappear={() => console.log('onDisappear')}
      previewActions={[
        {
          type: 'destructive',
          label: translate("Remove"),
          onPress: () => this.removeDay(id, day),
        },
      ]}>
        <TouchableOpacity style={journalStyle.content} key={day} activeOpacity={1}
        onPress={() => this.setState({selectedDay: day})}>
          <Text style={[styles.headline, content && content.length > 0 && {marginBottom: 8}]}>{name}</Text>
          {content && content.map((item, index) => this.renderItem(id, day, index, item))}
        </TouchableOpacity>
        
        {selectedDay == day && <TextInput
          style={[styles.textInput, {borderColor: this.state.text ? Colors.Active : Colors.LightGray, marginBottom: 24, marginTop: 0}]}
          placeholder={translate("What do you have to do?")}
          placeholderTextColor={Colors.LightGray}
          onChangeText={text => this.setState({ text })}
          onSubmitEditing={event => this.addItem(id, selectedDay, event.nativeEvent.text)}
          value={this.state.text}
          returnKeyType="done"
        />}
    </PeekAndPop>
  }

  renderWeek = id => {
    const week = this.weeks[id];
    const {selectedDay} = this.state;

    return (
      <View style={{margin: 16}}>
        {WEEK_DAYS.map((item, index) => this.renderDay(id, week.days && (week.days[index] || []), index))}
      </View>
    );
  }

  componentDidMount = () => {
    PursuitOfHappiness.Database.weeklyTodoRef.on("value", snapshot => {
      this.weeks = snapshot.val();
      this.setState({weeks: this.weeks ? Object.keys(this.weeks).reverse() : []}, () => {
        const weeks = this.state.weeks;
        if(weeks.length == 0 || this.weeks[weeks[weeks.length-1]].cw != CW) {
          PursuitOfHappiness.Database.weeklyTodoRef.push({
            cw: CW,
          });
        }
      });
    });
  }

  WeeklyRoute = () => (
    <View style={styles.container}>
      <Accordion
        sections={this.state.weeks}
        activeSections={this.state.activeSections}
        renderHeader={this.renderHeader}
        renderContent={this.renderWeek}
        onChange={activeSections => this.setState({ activeSections })}
        underlayColor={Colors.WhiteGray}
      />
    </View>
  )

  DailyRoute = () => (
    <View style={styles.container}>

    </View>
  )
  
  OverallRoute = () => (
    <View style={styles.container}>

    </View>
  )

  onIndexChange = index => {
    this.setState({index});
  }
  
  renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={[styles.tabViewIndicator, {marginBottom: 14}]}
      renderLabel={({ route, color }) => <Text style={[styles.tabViewText, {color}]}>{route.title}</Text>}
      tabStyle={{width: "auto"}}
      activeColor={Colors.Black}
      inactiveColor={Colors.ExtraLightGray}
      style={{ backgroundColor: 'transparent', marginHorizontal: 16}}
      contentContainerStyle={{ borderBottomWidth: 0, paddingBottom: 4 }}
    />	
  );

  render() {
    const {index, routes} = this.state;

    return <KeyboardAwareScrollView keyboardOpeningTime={0}
    keyboardShouldPersistTaps='handled'
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={styles.scrollContainer}
    showsVerticalScrollIndicator={false}>
      
      <TabView
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'overall':
              return this.OverallRoute();
            case 'weekly':
              return this.WeeklyRoute();
            case 'daily':
              return this.DailyRoute();
            default:
              return null;
          }
        }}
        onIndexChange={this.onIndexChange}
        renderTabBar={this.renderTabBar}
      />
    </KeyboardAwareScrollView>
  }
}