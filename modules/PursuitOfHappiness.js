import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {trans} from "../App";

database().setPersistenceEnabled(true);
database().setPersistenceCacheSizeBytes(20000000); //20MB

export const translate = trans;

export class Database {
  
  constructor() {
    if(auth().currentUser) {
      this.user = auth().currentUser;
      this.userRef = database().ref("users").child(this.user.uid);
      this.journalRef = database().ref("journals").child(this.user.uid);
      this.weeklyTodoRef = database().ref("weeklyTodo").child(this.user.uid);
      this.dailyTodoRef = database().ref("dailyTodo").child(this.user.uid);
      this.overallTodoRef = database().ref("overallTodo").child(this.user.uid);
    }

    auth().onAuthStateChanged(user => {
      if(user) {
        this.user = user;
        this.userRef = database().ref("users").child(this.user.uid);
        this.journalRef = database().ref("journals").child(this.user.uid);
        this.weeklyTodoRef = database().ref("weeklyTodo").child(this.user.uid);
        this.dailyTodoRef = database().ref("dailyTodo").child(this.user.uid);
        this.overallTodoRef = database().ref("overallTodo").child(this.user.uid);
      }
    })
  }
}

export class PursuitOfHappiness {
  constructor() {
    this.Database = new Database(this);

    this.blurApp = () => {};
  }
}

export default new PursuitOfHappiness;