import {Component} from '@angular/core';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  where,
  query,
  getDocs,
  updateDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userEmail = '';
  score = 0;
  constructor(private db: Firestore) { }

  ionViewDidEnter() {
    GoogleAuth.initialize();
    const users = collection(this.db, 'users');

    // Display the list of users.
    getDocs(users).then(querySnapshot => {
      querySnapshot.forEach((document) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(document.id, ' => ', document.data());
      });
    });

    // Observe the test user.
    const docRef = doc(this.db, 'users', 'p5ioeSdGAaoYbZWV3Eja');
    onSnapshot(docRef, snapshot => {
      console.log(snapshot.data());
    });
  }

  async doLogin() {
    const user = await GoogleAuth.signIn();
    if (user) {
      this.goToHome(user);
    }
  }

  goToHome(user) {
    console.log('User :', user);
    this.userEmail = user.email;

    const q = query(collection(this.db, 'users'), where('email', '==', this.userEmail));
    getDocs(q).then(querySnapshot => {
      if (querySnapshot.empty) {
        // Logged user does not exist, add it to the list of users.
        setDoc(doc(collection(this.db, 'users'), user.email), {
          uid: user.id,
          email: user.email,
          firstName: user.givenName,
          lastName: user.familyName,
          score: 0,
        }).then(() => this.observeLoggedUserInformation());
      } else {
        // Logged user exists, retrieve his information.
        querySnapshot.forEach((document) => {
          this.score = document.data().score;
        });
        this.observeLoggedUserInformation();
      }
    });
  }

  observeLoggedUserInformation(): void {
    const docRef = doc(this.db, 'users', this.userEmail);
    onSnapshot(docRef, snapshot => {
      this.score = snapshot.data().score;
    });
  }

  increaseScore(): void {
    // Increase the score without modifying the score variable.
    updateDoc(doc(collection(this.db, 'users'), this.userEmail), {
      score: this.score+1,
    });
  }
}
