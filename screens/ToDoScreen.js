import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles, Colors, Fonts, journalStyle } from '../styles';
import PursuitOfHappiness from '../modules/PursuitOfHappiness';
import Accordion from 'react-native-collapsible/Accordion';
import Section from '../components/Section';
import {translate} from "../App";
import moment from 'moment';
import { ContextMenuView } from "react-native-ios-context-menu";
import { TabView, TabBar } from 'react-native-tab-view';
import ListItem from '../components/ListItem';

const CW = moment().week();
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default class ToDoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: 'ToDo',
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("Events")} activeOpacity={0.8}>
          <Text style={[styles.headerButtonText, {color: Colors.Normal}]}>{translate("Events")}</Text>
        </TouchableOpacity>
      ),
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
    this.overall = {};
  }

  addDailyItem = (id, day, text) => {
    if(text) {
      PursuitOfHappiness.Database.dailyTodoRef.child(id.toString()).child(day.toString()).push({
        done: false,
        text,
      });
    }
  }

  removeDailyItem = (id, day, item) => {
    PursuitOfHappiness.Database.dailyTodoRef.child(id).child(day.toString()).child(item).remove();
  }
  
  setDailyItemDone = (id, day, item, done) => {
    const {eventId, dataId} = this.dailyWeeks[id][day][item];
    if(done) {
      const ref = PursuitOfHappiness.Database.eventDataRef.child(eventId).push({date: Date.now()});
      PursuitOfHappiness.Database.dailyTodoRef.child(id).child(day.toString()).child(item).update({done, dataId: ref.key});
    } else {
      PursuitOfHappiness.Database.eventDataRef.child(eventId).child(dataId).remove();
      PursuitOfHappiness.Database.dailyTodoRef.child(id).child(day.toString()).child(item).update({done});
    }
  }

  addWeeklyItem = (id, text) => {
    if(text) {
      PursuitOfHappiness.Database.weeklyTodoRef.child(id).push({
        done: false,
        text,
      });
    }
  }

  removeWeeklyItem = (id, item) => {
    PursuitOfHappiness.Database.weeklyTodoRef.child(id).child(item).remove();
  }
  
  setWeeklyItemDone = (id, item, done) => {
    const {eventId, dataId} = this.weeklyWeeks[id][item];
    if(done) {
      const ref = PursuitOfHappiness.Database.eventDataRef.child(eventId).push({date: Date.now()});
      PursuitOfHappiness.Database.weeklyTodoRef.child(id).child(item).update({done, dataId: ref.key});
    } else {
      PursuitOfHappiness.Database.eventDataRef.child(eventId).child(dataId).remove();
      PursuitOfHappiness.Database.weeklyTodoRef.child(id).child(item).update({done});
    }
  }

  addOverallItem = text => {
    if(text) {
      PursuitOfHappiness.Database.overallTodoRef.push({
        done: false,
        text,
      });
    }
  }

  removeOverallItem = item => {
    PursuitOfHappiness.Database.overallTodoRef.child(item).remove();
  }
  
  setOverallItemDone = (item, done) => {
    const {eventId, dataId} = this.overall[item];
    if(done) {
      const ref = PursuitOfHappiness.Database.eventDataRef.child(eventId).push({date: Date.now()});
      PursuitOfHappiness.Database.overallTodoRef.child(item).update({done, dataId: ref.key});
    } else {
      PursuitOfHappiness.Database.eventDataRef.child(eventId).child(dataId).remove();
      PursuitOfHappiness.Database.overallTodoRef.child(item).update({done});
    }
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

  renderDailyItem = (id, day, item) => {
    if(item) {
      const {done, text, time} = this.dailyWeeks[id][day][item];

      return <ContextMenuView
      key={item}
      menuConfig={{
        menuTitle: '',
        menuItems: [
          {
            actionKey: "0",
            actionTitle: translate("Done"),
          },
          {
            actionKey: "1",
            actionTitle: translate("Remove"),
            menuAttributes: ["destructive"],
          },
        ]
      }}
      onPressMenuItem={({nativeEvent}) => {
        var key = nativeEvent.actionKey;
        if(key == "0") {
          this.setDailyItemDone(id, day, item, !done);
        } else if(key == "1") {
          this.removeDailyItem(id, day, item);
        }
      }}>
        <ListItem title={text} done={done} time={time} onPress={() => {
          this.setDailyItemDone(id, day, item, !done);
        }} />
      </ContextMenuView>;
    }
  }

  renderWeeklyItem = (id, item) => {
    if(item) {
      const {done, text, time} = this.weeklyWeeks[id][item];

      return <ContextMenuView 
      key={item}
      menuConfig={{
        menuTitle: '',
        menuItems: [
          {
            actionKey: "0",
            actionTitle: translate("Done"),
          },
          {
            actionKey: "1",
            actionTitle: translate("Remove"),
            menuAttributes: ['destructive'],
          },
        ]}
      }
      onPressMenuItem={({nativeEvent}) => {
        var key = nativeEvent.actionKey;
        if(key == "0") {
          this.setWeeklyItemDone(id, item, !done);
        } else if(key == "1") {
          this.removeWeeklyItem(id, item);
        }
      }}>
        <ListItem title={text} done={done} time={time} onPress={() => {
          this.setWeeklyItemDone(id, item, !done);
        }} />
      </ContextMenuView>;
    }
  }

  renderDay = (id, content, day) => {
    var name = WEEK_DAYS[day];
    const {selectedDay} = this.state;
    const key = id + day;

    return <TouchableOpacity style={journalStyle.day} activeOpacity={1} onPress={() => this.setState({selectedDay: day})} key={key}>
      <Text style={[styles.headline, {margin: 12}]}>{translate(name)}</Text>

      {content && Object.keys(content).sort().map(item => this.renderDailyItem(id, day, item))}
      
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
        {WEEK_DAYS.map((item, index) => this.renderDay(id, week[index], index))}
      </View>
    );
  }

  renderWeeklyWeek = id => {
    const items = this.weeklyWeeks[id];

    return (
      <View style={{margin: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}}>
        <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("I want to do")}</Text>

        {items && Object.keys(items).sort().map(item => this.renderWeeklyItem(id, item))}
        
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
      this.dailyWeeks = snapshot.val() || {};
      if(!this.dailyWeeks["-" + CW]) this.dailyWeeks["-" + CW] = [];
      this.setState({dailyWeeks: Object.keys(this.dailyWeeks).sort().reverse()});
    });
    
    PursuitOfHappiness.Database.weeklyTodoRef.on("value", snapshot => {
      this.weeklyWeeks = snapshot.val() || [];
      if(!this.weeklyWeeks["-" + CW]) this.weeklyWeeks["-" + CW] = [];
      this.setState({weeklyWeeks: Object.keys(this.weeklyWeeks).sort().reverse()});
    });
    
    PursuitOfHappiness.Database.overallTodoRef.on("value", snapshot => {
      this.overall = snapshot.val() || {};
      this.setState({overall: Object.keys(this.overall).sort()});
    });
  }

  DailyRoute = () => (
    <View style={styles.container}>
      <Accordion
        sections={this.state.dailyWeeks}
        activeSections={this.state.activeDailySections}
        renderHeader={this.renderHeader}
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
        renderHeader={this.renderHeader}
        renderContent={this.renderWeeklyWeek}
        onChange={activeWeeklySections => this.setState({ activeWeeklySections })}
        underlayColor={Colors.WhiteGray}
      />
    </View>
  )

  renderOverallItem = item => {
    const {text, done, time} = this.overall[item];

    return (
      <ContextMenuView 
      key={item}
      menuConfig={{
        menuTitle: '',
        menuItems: [
          {
            actionKey: "0",
            actionTitle: translate("Done"),
          },
          {
            actionKey: "1",
            actionTitle: translate("Remove"),
            menuAttributes: ['destructive'],
          },
        ]}
      }
      onPressMenuItem={({nativeEvent}) => {
        var key = nativeEvent.actionKey;
        if(key == "0") {
          this.setOverallItemDone(item, !done);
        } else if(key == "1") {
          this.removeOverallItem(item);
        }
      }}>
        <ListItem title={text} done={done} time={time} onPress={() => {
          this.setOverallItemDone(item, !done);
        }} />
      </ContextMenuView>
    );
  }
  
  OverallRoute = () => (
    <View style={{margin: 16, backgroundColor: Colors.WhiteGray, borderRadius: 10}}>
      <Text style={[styles.headline, {fontSize: 20, margin: 12}]}>{translate("I want to do")}</Text>

      {this.state.overall.map(item => this.renderOverallItem(item))}
      
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