import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

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
        
        this.lectionsRef = database().ref("lections");
      }
    })
  }
}

export class PursuitOfHappiness {
  constructor() {
    this.Database = new Database(this);
  }
}

export default new PursuitOfHappiness;