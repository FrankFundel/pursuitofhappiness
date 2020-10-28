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
        { key: 'daily', title: translate('Daily') },
        { key: 'weekly', title: translate('Weekly') },
        { key: 'overall', title: translate('Overall') },
      ],
      text: "",
      textHeight: 48,
      dailyWeeks: [],
      activeDailySections: [0],
      selectedDay: 0,
      weeklyWeeks: [],
      activeWeeklySections: [0],
      overall: [],
    };

    this.dailyWeeks = {};
    this.weeklyWeeks = {};
  }

  addDailyItem = (id, day, text) => {
    if(text) {
      var week = this.dailyWeeks[id];
      if(!week.days) {
        PursuitOfHappiness.Database.dailyTodoRef.child(id).child("days").set({[day]: [{
          done: false,
          text,
        }]});
      } else if(!week.days[day]) {
        PursuitOfHappiness.Database.dailyTodoRef.child(id).child("days").child(day.toString()).set([{
          done: false,
          text,
        }]);
      } else {
        PursuitOfHappiness.Database.dailyTodoRef.child(id).child("days").child(day.toString()).child(week.days[day].length.toString()).set({
          done: false,
          text,
        });
      }
    }
  }

  removeDailyItem = (id, day, index) => {
    PursuitOfHappiness.Database.dailyTodoRef.child(id).child("days").child(day.toString()).child(index.toString()).remove();
  }
  
  setDailyItemDone = (id, day, index, done) => {
    PursuitOfHappiness.Database.dailyTodoRef.child(id).child("days").child(day.toString()).child(index.toString()).update({done});
  }

  addWeeklyItem = (id, text) => {
    if(text) {
      var week = this.weeklyWeeks[id];
      if(!week.content) {
        PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("content").set([{
          done: false,
          text,
        }]);
      } else {
        PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("content").child(week.content.length.toString()).set({
          done: false,
          text,
        });
      }
    }
  }

  removeWeeklyItem = (id, index) => {
    PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("content").child(index.toString()).remove();
  }
  
  setWeeklyItemDone = (id, index, done) => {
    PursuitOfHappiness.Database.weeklyTodoRef.child(id).child("content").child(index.toString()).update({done});
  }

  addOverallItem = text => {
    if(text) {
      PursuitOfHappiness.Database.overallTodoRef.child(this.state.overall.length.toString()).set({
        done: false,
        text,
      });
    }
  }

  removeOverallItem = index => {
    PursuitOfHappiness.Database.overallTodoRef.child(index.toString()).remove();
  }
  
  setOverallItemDone = (index, done) => {
    PursuitOfHappiness.Database.overallTodoRef.child(index.toString()).update({done});
  }

  renderDailyHeader = (id, index, isActive) => {
    const week = this.dailyWeeks[id];
    var title;
    if(week.cw == moment().week()) {
      title = translate("This Week");
    } else {
      title = translate("CW") + " " + week.cw;
    }
    return <Section title={title} isActive={isActive} />;
  }

  renderWeeklyHeader = (id, index, isActive) => {
    const week = this.weeklyWeeks[id];
    var title;
    if(week.cw == moment().week()) {
      title = translate("This Week");
    } else {
      title = translate("CW") + " " + week.cw;
    }
    return <Section title={title} isActive={isActive} />;
  }

  renderDailyItem = (id, day, index, item) => {
    if(item) {
      const {done, text} = item;
      const key = id + day + index;

      return <PeekAndPop
      key={key}
      renderPreview={() => <ListItem title={text} done={done} key={key} style={journalStyle.contentPeek} />}
      onPeek={() => PursuitOfHappiness.blurApp(true)}
      onDisappear={() => PursuitOfHappiness.blurApp(false)}
      previewActions={[
        {
          type: 'normal',
          label: translate("Done"),
          onPress: () => this.setDailyItemDone(id, day, index, !done),
        },
        {
          type: 'destructive',
          label: translate("Remove"),
          onPress: () => this.removeDailyItem(id, day, index),
        },
      ]}>
        <ListItem title={text} done={done} key={key} onPress={() => {
          this.setDailyItemDone(id, day, index, !done);
        }} />
      </PeekAndPop>;
    }
  }

  renderWeeklyItem = (id, index, item) => {
    if(item) {
      const {done, text} = item;
      const key = id + index;

      return <PeekAndPop
      key={key}
      renderPreview={() => <ListItem title={text} done={done} key={key} style={journalStyle.contentPeek} />}
      onPeek={() => PursuitOfHappiness.blurApp(true)}
      onDisappear={() => PursuitOfHappiness.blurApp(false)}
      previewActions={[
        {
          type: 'normal',
          label: translate("Done"),
          onPress: () => this.setWeeklyItemDone(id, index, !done),
        },
        {
          type: 'destructive',
          label: translate("Remove"),
          onPress: () => this.removeWeeklyItem(id, index),
        },
      ]}>
        <ListItem title={text} done={done} key={key} onPress={() => {
          this.setWeeklyItemDone(id, index, !done);
        }} />
      </PeekAndPop>;
    }
  }

  renderDay = (id, content, day) => {
    var name = WEEK_DAYS[day];
    const {selectedDay} = this.state;
    const key = id + day;

    return <TouchableOpacity style={journalStyle.day} activeOpacity={1} onPress={() => this.setState({selectedDay: day})} key={key}>
      <Text style={[styles.headline, {margin: 12}]}>{name}</Text>

      {content && content.map((item, index) => this.renderDailyItem(id, day, index, item))}
      
      {selectedDay == day && <TextInput
        style={[journalStyle.textInput, {height: this.state.textHeight > 90 ? 90 : this.state.textHeight}]}
        placeholder={translate("What do you want to do?")}
        placeholderTextColor={Colors.LightGray}
        onSubmitEditing={event => this.addDailyItem(id, selectedDay, event.nativeEvent.text)}
        value={this.state.text}
        returnKeyType="done"
        blurOnSubmit={false}
        multiline
        onContentSizeChange={({nativeEvent}) => this.setState({ textHeight: nativeEvent.contentSize.height + 28 })}
        onKeyPress={({nativeEvent}) => this.setState({text: nativeEvent.key === 'Enter' ? "" : nativeEvent.text})}
      />}
    </TouchableOpacity>
  }

  renderDailyWeek = id => {
    const week = this.dailyWeeks[id];
    return (
      <View style={{margin: 16}}>
        {WEEK_DAYS.map((item, index) => this.renderDay(id, week.days && (week.days[index] || []), index))}
      </View>
    );
  }

  renderWeeklyWeek = id => {
    const week = this.weeklyWeeks[id];

    return (
      <View style={{margin: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}}>
        <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("I want to do")}</Text>

        {week.content && week.content.map((item, index) => this.renderWeeklyItem(id, index, item))}
        
        <TextInput
          style={[journalStyle.textInput, {height: this.state.textHeight > 90 ? 90 : this.state.textHeight}]}
          placeholder={translate("What do you want to do?")}
          placeholderTextColor={Colors.LightGray}
          onSubmitEditing={event => this.addWeeklyItem(id, event.nativeEvent.text)}
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
    PursuitOfHappiness.Database.dailyTodoRef.on("value", snapshot => {
      this.dailyWeeks = snapshot.val();
      this.setState({dailyWeeks: this.dailyWeeks ? Object.keys(this.dailyWeeks).reverse() : []}, () => {
        const dailyWeeks = this.state.dailyWeeks;
        if(dailyWeeks.length == 0 || this.dailyWeeks[dailyWeeks[dailyWeeks.length-1]].cw != CW) {
          PursuitOfHappiness.Database.dailyTodoRef.push({
            cw: CW,
          });
        }
      });
    });
    
    PursuitOfHappiness.Database.weeklyTodoRef.on("value", snapshot => {
      this.weeklyWeeks = snapshot.val();
      this.setState({weeklyWeeks: this.weeklyWeeks ? Object.keys(this.weeklyWeeks).reverse() : []}, () => {
        const weeklyWeeks = this.state.weeklyWeeks;
        if(weeklyWeeks.length == 0 || this.weeklyWeeks[weeklyWeeks[weeklyWeeks.length-1]].cw != CW) {
          PursuitOfHappiness.Database.weeklyTodoRef.push({
            cw: CW,
          });
        }
      });
    });
    
    PursuitOfHappiness.Database.overallTodoRef.on("value", snapshot => {
      this.setState({overall: snapshot.val() || []});
    });
  }

  DailyRoute = () => (
    <View style={styles.container}>
      <Accordion
        sections={this.state.dailyWeeks}
        activeSections={this.state.activeDailySections}
        renderHeader={this.renderDailyHeader}
        renderContent={this.renderDailyWeek}
        onChange={activeDailySections => this.setState({ activeDailySections })}
        underlayColor={Colors.WhiteGray}
      />
    </View>
  )

  WeeklyRoute = () => (
    <View style={styles.container}>
      <Accordion
        sections={this.state.weeklyWeeks}
        activeSections={this.state.activeWeeklySections}
        renderHeader={this.renderWeeklyHeader}
        renderContent={this.renderWeeklyWeek}
        onChange={activeWeeklySections => this.setState({ activeWeeklySections })}
        underlayColor={Colors.WhiteGray}
      />
    </View>
  )
  
  OverallRoute = () => (
    <View style={{margin: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}}>
      <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("I want to do")}</Text>

      {this.state.overall.map(({text, done}, index) => <PeekAndPop
      key={index}
      renderPreview={() => <ListItem title={text} done={done} key={index} style={journalStyle.contentPeek} />}
      onPeek={() => PursuitOfHappiness.blurApp(true)}
      onDisappear={() => PursuitOfHappiness.blurApp(false)}
      previewActions={[
        {
          type: 'normal',
          label: translate("Done"),
          onPress: () => this.setOverallItemDone(index, !done),
        },
        {
          type: 'destructive',
          label: translate("Remove"),
          onPress: () => this.removeOverallItem(index),
        },
      ]}>
        <ListItem title={text} done={done} key={index} onPress={() => {
          this.setOverallItemDone(index, !done);
        }} />
      </PeekAndPop>)}
      
      <TextInput
        style={[journalStyle.textInput, {height: this.state.textHeight > 90 ? 90 : this.state.textHeight}]}
        placeholder={translate("What do you want to do?")}
        placeholderTextColor={Colors.LightGray}
        onSubmitEditing={event => this.addOverallItem(event.nativeEvent.text)}
        value={this.state.text}
        returnKeyType="done"
        blurOnSubmit={false}
        multiline
        onContentSizeChange={event => this.setState({ textHeight: event.nativeEvent.contentSize.height + 28 })}
        onKeyPress={({nativeEvent}) => this.setState({text: nativeEvent.key === 'Enter' ? "" : nativeEvent.text})}
      />
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
            case 'daily':
              return this.DailyRoute();
            case 'weekly':
              return this.WeeklyRoute();
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