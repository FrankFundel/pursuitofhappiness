import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require("react-native-push-notification");
import moment from 'moment';
import { Platform } from 'react-native';

database().setPersistenceEnabled(true);
database().setPersistenceCacheSizeBytes(20000000); //20MB

export class Database {
  
  constructor() {
    if(auth().currentUser) {
      this.user = auth().currentUser;
      this.userRef = database().ref("users").child(this.user.uid);
      this.journalRef = database().ref("journals").child(this.user.uid);
      this.weeklyTodoRef = database().ref("weeklyTodo").child(this.user.uid);
      this.dailyTodoRef = database().ref("dailyTodo").child(this.user.uid);
      this.overallTodoRef = database().ref("overallTodo").child(this.user.uid);
      this.dailyEventsRef = database().ref("dailyEvents").child(this.user.uid);
      this.weeklyEventsRef = database().ref("weeklyEvents").child(this.user.uid);
      this.lectionDataRef = database().ref("lectionData").child(this.user.uid);
      this.eventDataRef = database().ref("eventData").child(this.user.uid);

      this.lectionsRef = database().ref("lections");
    }

    auth().onAuthStateChanged(user => {
      if(user) {
        this.user = user;
        this.userRef = database().ref("users").child(this.user.uid);
        this.journalRef = database().ref("journals").child(this.user.uid);
        this.weeklyTodoRef = database().ref("weeklyTodo").child(this.user.uid);
        this.dailyTodoRef = database().ref("dailyTodo").child(this.user.uid);
        this.overallTodoRef = database().ref("overallTodo").child(this.user.uid);
        this.dailyEventsRef = database().ref("dailyEvents").child(this.user.uid);
        this.weeklyEventsRef = database().ref("weeklyEvents").child(this.user.uid);
        this.lectionDataRef = database().ref("lectionData").child(this.user.uid);
        this.eventDataRef = database().ref("eventData").child(this.user.uid);
        
        this.lectionsRef = database().ref("lections");
      }
    })
  }

  addProgress = async (lectionId, amount) => {
    const progress = (await this.lectionDataRef.child(lectionId).child("progress").once("value")).val();
    this.lectionDataRef.child(lectionId).update({progress: progress + amount});
  }
  subProgress = async (lectionId, amount) => {
    const progress = (await this.lectionDataRef.child(lectionId).child("progress").once("value")).val();
    this.lectionDataRef.child(lectionId).update({progress: progress - amount});
  }
}

export class Notifications {

  constructor() {
    if(Platform.OS == "ios") {
        PushNotificationIOS.getScheduledLocalNotifications(events => {
        console.log(events);
      });
    }
  }

  addSchedule = (id, message, time, repeatType) => {
    var date = time ? moment(time, "hh:mm") : Date.now();
    PushNotification.localNotificationSchedule({
      id,
      message,
      date: new Date(date),
      allowWhileIdle: true,
      repeatType,
    });
  }

  removeSchedule = id => {
    PushNotification.cancelLocalNotifications({id});
  }
}

export class PursuitOfHappiness {
  constructor() {
    this.Database = new Database(this);
    this.Notifications = new Notifications(this);
  }
}

export default new PursuitOfHappiness;